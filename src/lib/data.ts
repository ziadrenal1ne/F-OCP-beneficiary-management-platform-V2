import { db } from "@/db";
import {
  cooperatives, beneficiaryRecords, reports, documents, conventions,
  esgIndicators, odds, cooperativeOdds, notifications, auditLogs, users,
} from "@/db/schema";
import { eq, desc, asc, and, sql, inArray, gte, like, or } from "drizzle-orm";

const now = new Date();
const CUR_MONTH = now.getMonth() + 1;
const CUR_YEAR = now.getFullYear();

export async function getAdminKpis() {
  const coopRows = await db.select().from(cooperatives);
  const totalCooperatives = coopRows.length;

  const latestBeneficiaries = await db
    .select({
      cooperativeId: beneficiaryRecords.cooperativeId,
      women: beneficiaryRecords.women,
      men: beneficiaryRecords.men,
      youth: beneficiaryRecords.youth,
      disabled: beneficiaryRecords.disabled,
      indirect: beneficiaryRecords.indirect,
      month: beneficiaryRecords.month,
      year: beneficiaryRecords.year,
    })
    .from(beneficiaryRecords)
    .where(and(eq(beneficiaryRecords.month, CUR_MONTH), eq(beneficiaryRecords.year, CUR_YEAR)));

  const totals = latestBeneficiaries.reduce(
    (acc, r) => {
      acc.women += r.women; acc.men += r.men; acc.youth += r.youth;
      acc.disabled += r.disabled; acc.indirect += r.indirect;
      return acc;
    },
    { women: 0, men: 0, youth: 0, disabled: 0, indirect: 0 }
  );
  const totalBeneficiaries = totals.women + totals.men;

  const [{ count: totalReports }] = await db.select({ count: sql<number>`count(*)` }).from(documents);
  const [{ count: totalConventions }] = await db.select({ count: sql<number>`count(*)` }).from(conventions);
  const [{ count: pendingValidations }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reports)
    .where(eq(reports.status, "SUBMITTED"));

  return { totalCooperatives, totalBeneficiaries, ...totals, totalReports, totalConventions, pendingValidations };
}

export async function getMonthlyEvolution(cooperativeId?: string) {
  const rows = cooperativeId
    ? await db.select().from(beneficiaryRecords).where(eq(beneficiaryRecords.cooperativeId, cooperativeId)).orderBy(asc(beneficiaryRecords.year), asc(beneficiaryRecords.month))
    : await db.select().from(beneficiaryRecords).orderBy(asc(beneficiaryRecords.year), asc(beneficiaryRecords.month));

  const byMonth = new Map<string, { month: number; year: number; women: number; men: number; youth: number; total: number }>();
  for (const r of rows) {
    const key = `${r.year}-${r.month}`;
    const cur = byMonth.get(key) ?? { month: r.month, year: r.year, women: 0, men: 0, youth: 0, total: 0 };
    cur.women += r.women; cur.men += r.men; cur.youth += r.youth;
    cur.total = cur.women + cur.men;
    byMonth.set(key, cur);
  }
  return Array.from(byMonth.values()).sort((a, b) => a.year - b.year || a.month - b.month);
}

const MONTH_NAMES_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
export function monthLabel(month: number, year: number) {
  return `${MONTH_NAMES_FR[month - 1]} ${year}`;
}

export async function getOddDistribution() {
  const rows = await db
    .select({ oddNumber: odds.number, name: odds.nameFr, color: odds.color, count: sql<number>`count(*)` })
    .from(cooperativeOdds)
    .innerJoin(odds, eq(cooperativeOdds.oddId, odds.id))
    .groupBy(odds.id)
    .orderBy(desc(sql`count(*)`));
  return rows;
}

export async function getRecentActivity(limit = 8) {
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
}

export async function getNotificationsForUser(userId: string, limit = 20) {
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function getUnreadNotificationCount(userId: string) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  return count;
}

export async function getAllCooperatives(filters?: {
  region?: string; province?: string; sector?: string; status?: string; search?: string; oddNumber?: number;
}) {
  const conds = [];
  if (filters?.region && filters.region !== "all") conds.push(eq(cooperatives.region, filters.region));
  if (filters?.province && filters.province !== "all") conds.push(eq(cooperatives.province, filters.province));
  if (filters?.sector && filters.sector !== "all") conds.push(eq(cooperatives.sector, filters.sector));
  if (filters?.status && filters.status !== "all") conds.push(eq(cooperatives.status, filters.status as any));
  if (filters?.search) {
    conds.push(
      or(
        like(cooperatives.name, `%${filters.search}%`),
        like(cooperatives.city, `%${filters.search}%`),
        like(cooperatives.province, `%${filters.search}%`)
      )
    );
  }

  const rows = conds.length ? await db.select().from(cooperatives).where(and(...conds)) : await db.select().from(cooperatives);

  // attach odds + latest beneficiary snapshot
  const allCoopOdds = await db.select().from(cooperativeOdds).innerJoin(odds, eq(cooperativeOdds.oddId, odds.id));
  const oddsByCoop = new Map<string, { number: number; name: string; color: string }[]>();
  for (const row of allCoopOdds) {
    const arr = oddsByCoop.get(row.cooperative_odds.cooperativeId) ?? [];
    arr.push({ number: row.odds.number, name: row.odds.nameFr, color: row.odds.color });
    oddsByCoop.set(row.cooperative_odds.cooperativeId, arr);
  }

  const latestBen = await db.select().from(beneficiaryRecords).where(and(eq(beneficiaryRecords.month, CUR_MONTH), eq(beneficiaryRecords.year, CUR_YEAR)));
  const benByCoop = new Map(latestBen.map((b) => [b.cooperativeId, b]));

  let result = rows.map((c) => ({
    ...c,
    odds: oddsByCoop.get(c.id) ?? [],
    beneficiaries: benByCoop.get(c.id),
  }));

  if (filters?.oddNumber) {
    result = result.filter((c) => c.odds.some((o) => o.number === filters.oddNumber));
  }

  return result;
}

export async function getCooperativeById(id: string) {
  const [coop] = await db.select().from(cooperatives).where(eq(cooperatives.id, id));
  if (!coop) return null;

  const coopOddsRows = await db.select().from(cooperativeOdds).innerJoin(odds, eq(cooperativeOdds.oddId, odds.id)).where(eq(cooperativeOdds.cooperativeId, id));
  const beneficiaryHistory = await db.select().from(beneficiaryRecords).where(eq(beneficiaryRecords.cooperativeId, id)).orderBy(asc(beneficiaryRecords.year), asc(beneficiaryRecords.month));
  const reportRows = await db.select().from(reports).where(eq(reports.cooperativeId, id)).orderBy(desc(reports.year), desc(reports.month));
  const documentRows = await db.select().from(documents).where(eq(documents.cooperativeId, id)).orderBy(desc(documents.uploadedAt));
  const conventionRows = await db.select().from(conventions).where(eq(conventions.cooperativeId, id)).orderBy(desc(conventions.startDate));
  const esgRows = await db.select().from(esgIndicators).where(eq(esgIndicators.cooperativeId, id)).orderBy(asc(esgIndicators.year), asc(esgIndicators.month));

  return {
    ...coop,
    odds: coopOddsRows.map((r) => ({ number: r.odds.number, name: r.odds.nameFr, color: r.odds.color, icon: r.odds.icon })),
    beneficiaryHistory,
    reports: reportRows,
    documents: documentRows,
    conventions: conventionRows,
    esgHistory: esgRows,
  };
}

export async function getFilterOptions() {
  const rows = await db.select({ region: cooperatives.region, province: cooperatives.province, sector: cooperatives.sector }).from(cooperatives);
  const regions = Array.from(new Set(rows.map((r) => r.region))).sort();
  const provinces = Array.from(new Set(rows.map((r) => r.province))).sort();
  const sectors = Array.from(new Set(rows.map((r) => r.sector))).sort();
  const allOdds = await db.select().from(odds).orderBy(asc(odds.number));
  return { regions, provinces, sectors, odds: allOdds };
}

export async function getConventionsExpiringSoon(days = 60) {
  const rows = await db.select().from(conventions).innerJoin(cooperatives, eq(conventions.cooperativeId, cooperatives.id));
  const threshold = new Date(now.getTime() + days * 86400000);
  return rows
    .filter((r) => r.conventions.status !== "EXPIRED" && new Date(r.conventions.endDate) <= threshold)
    .map((r) => ({ ...r.conventions, cooperativeName: r.cooperatives.name }));
}

export async function getPendingReports() {
  const rows = await db.select().from(reports).innerJoin(cooperatives, eq(reports.cooperativeId, cooperatives.id)).where(eq(reports.status, "SUBMITTED")).orderBy(desc(reports.submittedAt));
  return rows.map((r) => ({ ...r.reports, cooperativeName: r.cooperatives.name, cooperativeCity: r.cooperatives.city }));
}

export async function getPendingDocuments() {
  const rows = await db.select().from(documents).innerJoin(cooperatives, eq(documents.cooperativeId, cooperatives.id)).where(eq(documents.status, "PENDING")).orderBy(desc(documents.uploadedAt));
  return rows.map((r) => ({ ...r.documents, cooperativeName: r.cooperatives.name }));
}

export { CUR_MONTH, CUR_YEAR };
