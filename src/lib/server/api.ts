import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from "@/lib/constants";
import type { Actor, CsvImportResult, DashboardKpis } from "@/lib/types";
import { parseNumeric } from "@/lib/utils";
import { assertAdmin, getActor, scopedCoopId, writeAudit } from "./actor";
import {
  LATEST_STATS_JOIN,
  mapAudit,
  mapConvention,
  mapCoop,
  mapDocument,
  mapEsg,
  mapMonth,
  mapNotification,
  mapOdd,
  mapReport,
  type CoopRow,
  type ReportRow,
} from "./mappers";

const idSchema = z.object({ id: z.number() });

function scopeId(actor: Actor): number | null {
  return actor.role === "cooperative" ? actor.cooperativeId : null;
}

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => getActor(context.userId));

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const sid = scopeId(actor);

    const kpiRows = await sql<{
      cooperatives: number;
      women: number;
      men: number;
      youth: number;
      disabled: number;
      indirect: number;
      reports: number;
      conventions: number;
      pending: number;
      documents: number;
    }>`
      select
        (select count(*)::int from cooperatives c
          where (${sid}::int is null or c.id = ${sid})) as cooperatives,
        coalesce((
          select sum(s.women)::int from cooperatives c
          left join lateral (
            select women from beneficiary_stats bs
            where bs.cooperative_id = c.id order by year desc, month desc limit 1
          ) s on true
          where (${sid}::int is null or c.id = ${sid})
        ), 0) as women,
        coalesce((
          select sum(s.men)::int from cooperatives c
          left join lateral (
            select men from beneficiary_stats bs
            where bs.cooperative_id = c.id order by year desc, month desc limit 1
          ) s on true
          where (${sid}::int is null or c.id = ${sid})
        ), 0) as men,
        coalesce((
          select sum(s.youth)::int from cooperatives c
          left join lateral (
            select youth from beneficiary_stats bs
            where bs.cooperative_id = c.id order by year desc, month desc limit 1
          ) s on true
          where (${sid}::int is null or c.id = ${sid})
        ), 0) as youth,
        coalesce((
          select sum(s.disabled)::int from cooperatives c
          left join lateral (
            select disabled from beneficiary_stats bs
            where bs.cooperative_id = c.id order by year desc, month desc limit 1
          ) s on true
          where (${sid}::int is null or c.id = ${sid})
        ), 0) as disabled,
        coalesce((
          select sum(s.indirect)::int from cooperatives c
          left join lateral (
            select indirect from beneficiary_stats bs
            where bs.cooperative_id = c.id order by year desc, month desc limit 1
          ) s on true
          where (${sid}::int is null or c.id = ${sid})
        ), 0) as indirect,
        (select count(*)::int from reports r
          where (${sid}::int is null or r.cooperative_id = ${sid})) as reports,
        (select count(*)::int from conventions v
          where (${sid}::int is null or v.cooperative_id = ${sid})) as conventions,
        (select count(*)::int from reports r
          where r.status = 'submitted' and (${sid}::int is null or r.cooperative_id = ${sid})) as pending,
        (select count(*)::int from documents d
          where (${sid}::int is null or d.cooperative_id = ${sid})) as documents
    `;

    const k = kpiRows[0];
    const kpis: DashboardKpis = {
      cooperatives: parseNumeric(k?.cooperatives),
      women: parseNumeric(k?.women),
      men: parseNumeric(k?.men),
      youth: parseNumeric(k?.youth),
      disabled: parseNumeric(k?.disabled),
      indirect: parseNumeric(k?.indirect),
      beneficiaries: parseNumeric(k?.women) + parseNumeric(k?.men),
      reports: parseNumeric(k?.reports),
      conventions: parseNumeric(k?.conventions),
      pendingValidations: parseNumeric(k?.pending),
      documents: parseNumeric(k?.documents),
    };

    const monthly = await sql<{
      year: number;
      month: number;
      women: number;
      men: number;
      youth: number;
      disabled: number;
      indirect: number;
    }>`
      select bs.year, bs.month,
        sum(bs.women)::int as women,
        sum(bs.men)::int as men,
        sum(bs.youth)::int as youth,
        sum(bs.disabled)::int as disabled,
        sum(bs.indirect)::int as indirect
      from beneficiary_stats bs
      where (${sid}::int is null or bs.cooperative_id = ${sid})
      group by bs.year, bs.month
      order by bs.year, bs.month
    `;

    const odds = await sql<{
      code: number;
      name_fr: string;
      short_name: string;
      color: string;
      count: number;
    }>`
      select o.code, o.name_fr, o.short_name, o.color, count(*)::int as count
      from cooperative_odds co
      join odds o on o.id = co.odd_id
      where (${sid}::int is null or co.cooperative_id = ${sid})
      group by o.code, o.name_fr, o.short_name, o.color
      order by count desc, o.code
    `;

    const activity = await sql<{
      id: number;
      user_id: string | null;
      action: string;
      entity_type: string;
      entity_id: string | null;
      details: string;
      created_at: string;
    }>`
      select id, user_id, action, entity_type, entity_id, details, created_at
      from audit_logs
      order by created_at desc
      limit 12
    `;

    const recentReports = await sql<ReportRow>`
      select r.*, c.name as cooperative_name
      from reports r
      join cooperatives c on c.id = r.cooperative_id
      where (${sid}::int is null or r.cooperative_id = ${sid})
      order by r.created_at desc
      limit 6
    `;

    const esg = await sql<{
      year: number;
      environmental_score: number | string;
      social_score: number | string;
      governance_score: number | string;
      water_saved_m3: number;
      renewable_energy_kwh: number;
      jobs_created: number;
      training_hours: number;
      notes: string;
    }>`
      select
        coalesce(max(year), 0) as year,
        coalesce(avg(environmental_score), 0) as environmental_score,
        coalesce(avg(social_score), 0) as social_score,
        coalesce(avg(governance_score), 0) as governance_score,
        coalesce(sum(water_saved_m3), 0)::int as water_saved_m3,
        coalesce(sum(renewable_energy_kwh), 0)::int as renewable_energy_kwh,
        coalesce(sum(jobs_created), 0)::int as jobs_created,
        coalesce(sum(training_hours), 0)::int as training_hours,
        ${"Indicateurs ESG consolidés."} as notes
      from esg_indicators
      where (${sid}::int is null or cooperative_id = ${sid})
    `;

    return {
      actor,
      kpis,
      monthly: monthly.map(mapMonth),
      odds: odds.map((o) => ({
        code: o.code,
        nameFr: o.name_fr,
        shortName: o.short_name,
        color: o.color,
        count: parseNumeric(o.count),
      })),
      activity: activity.map(mapAudit),
      recentReports: recentReports.map(mapReport),
      esg: esg[0] ? mapEsg(esg[0]) : null,
    };
  });

const searchSchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  sector: z.string().optional(),
  status: z.string().optional(),
  odd: z.number().optional(),
  minBeneficiaries: z.number().optional(),
});

export const listCooperatives = createServerFn({ method: "GET" })
  .validator(searchSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const params: unknown[] = [];
    const where: string[] = ["1=1"];
    if (actor.role === "cooperative" && actor.cooperativeId) {
      params.push(actor.cooperativeId);
      where.push(`c.id = $${params.length}`);
    }
    if (data.q?.trim()) {
      params.push(`%${data.q.trim()}%`);
      const p = params.length;
      where.push(`(c.name ilike $${p} or c.city ilike $${p} or c.sector ilike $${p})`);
    }
    if (data.region) {
      params.push(data.region);
      where.push(`c.region = $${params.length}`);
    }
    if (data.province) {
      params.push(data.province);
      where.push(`c.province = $${params.length}`);
    }
    if (data.city) {
      params.push(data.city);
      where.push(`c.city = $${params.length}`);
    }
    if (data.country) {
      params.push(data.country);
      where.push(`c.country = $${params.length}`);
    }
    if (data.sector) {
      params.push(data.sector);
      where.push(`c.sector = $${params.length}`);
    }
    if (data.status) {
      params.push(data.status);
      where.push(`c.status = $${params.length}`);
    }
    if (data.odd) {
      params.push(data.odd);
      where.push(
        `exists (select 1 from cooperative_odds co join odds o on o.id = co.odd_id where co.cooperative_id = c.id and o.code = $${params.length})`,
      );
    }
    if (data.minBeneficiaries && data.minBeneficiaries > 0) {
      params.push(data.minBeneficiaries);
      where.push(`coalesce(s.women,0) + coalesce(s.men,0) >= $${params.length}`);
    }

    const rows = await sql.query<CoopRow>(
      `select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       where ${where.join(" and ")}
       order by c.name`,
      params,
    );

    const oddRows = await sql<{
      cooperative_id: number;
      id: number;
      code: number;
      name_fr: string;
      short_name: string;
      color: string;
    }>`
      select co.cooperative_id, o.id, o.code, o.name_fr, o.short_name, o.color
      from cooperative_odds co join odds o on o.id = co.odd_id
      order by o.code
    `;
    const oddsByCoop = new Map<number, ReturnType<typeof mapOdd>[]>();
    for (const o of oddRows) {
      const list = oddsByCoop.get(o.cooperative_id) ?? [];
      list.push(mapOdd(o));
      oddsByCoop.set(o.cooperative_id, list);
    }

    return rows.map((r) => mapCoop(r, oddsByCoop.get(r.id) ?? []));
  });

export const getCooperative = createServerFn({ method: "GET" })
  .validator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    if (actor.role === "cooperative" && actor.cooperativeId !== data.id) {
      throw new Error("Accès non autorisé à cette coopérative");
    }
    const sql = await getSql();
    const rows = await sql.query<CoopRow>(
      `select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       where c.id = $1`,
      [data.id],
    );
    const row = rows[0];
    if (!row) throw new Error("Coopérative introuvable");
    const odds = await sql<{
      id: number;
      code: number;
      name_fr: string;
      short_name: string;
      color: string;
    }>`
      select o.id, o.code, o.name_fr, o.short_name, o.color
      from cooperative_odds co join odds o on o.id = co.odd_id
      where co.cooperative_id = ${data.id}
      order by o.code
    `;
    const months = await sql<{
      year: number;
      month: number;
      women: number;
      men: number;
      youth: number;
      adults: number;
      children: number;
      disabled: number;
      indirect: number;
    }>`
      select year, month, women, men, youth, adults, children, disabled, indirect
      from beneficiary_stats where cooperative_id = ${data.id}
      order by year, month
    `;
    const reports = await sql<ReportRow>`
      select r.*, c.name as cooperative_name from reports r
      join cooperatives c on c.id = r.cooperative_id
      where r.cooperative_id = ${data.id}
      order by r.year desc, r.month desc
    `;
    const conventions = await sql<{
      id: number;
      cooperative_id: number;
      cooperative_name: string;
      title: string;
      partner: string;
      start_date: string;
      end_date: string;
      amount: number | string;
      status: "active" | "expiring" | "expired" | "draft";
      description: string;
    }>`
      select v.*, c.name as cooperative_name from conventions v
      join cooperatives c on c.id = v.cooperative_id
      where v.cooperative_id = ${data.id}
      order by v.end_date desc
    `;
    const documents = await sql<{
      id: number;
      cooperative_id: number;
      cooperative_name: string;
      name: string;
      category: string;
      mime_type: string;
      size_bytes: number;
      version: number;
      status: "pending" | "approved" | "rejected";
      owner_user_id: string | null;
      has_content: boolean | number | string | null;
      uploaded_at: string;
    }>`
      select d.id, d.cooperative_id, c.name as cooperative_name, d.name, d.category, d.mime_type,
             d.size_bytes, d.version, d.status, d.owner_user_id,
             (d.content_base64 is not null) as has_content, d.uploaded_at
      from documents d join cooperatives c on c.id = d.cooperative_id
      where d.cooperative_id = ${data.id}
      order by d.uploaded_at desc
    `;
    const esg = await sql<{
      year: number;
      environmental_score: number | string;
      social_score: number | string;
      governance_score: number | string;
      water_saved_m3: number;
      renewable_energy_kwh: number;
      jobs_created: number;
      training_hours: number;
      notes: string;
    }>`
      select * from esg_indicators where cooperative_id = ${data.id} order by year desc limit 1
    `;
    return {
      cooperative: mapCoop(row, odds.map(mapOdd)),
      months: months.map(mapMonth),
      reports: reports.map(mapReport),
      conventions: conventions.map(mapConvention),
      documents: documents.map(mapDocument),
      esg: esg[0] ? mapEsg(esg[0]) : null,
    };
  });

const updateCoopSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  description: z.string(),
  address: z.string(),
  city: z.string().min(1),
  province: z.string().min(1),
  region: z.string().min(1),
  country: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  sector: z.string().min(1),
  legalStatus: z.string(),
  createdDate: z.string().nullable(),
  status: z.enum(["active", "pending", "suspended"]),
  oddCodes: z.array(z.number()),
});

export const updateCooperative = createServerFn({ method: "POST" })
  .validator(updateCoopSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    if (actor.role === "cooperative" && actor.cooperativeId !== data.id) {
      throw new Error("Accès non autorisé");
    }
    const sql = await getSql();
    if (actor.role === "admin") {
      await sql`
        update cooperatives set
          name = ${data.name}, description = ${data.description}, address = ${data.address},
          city = ${data.city}, province = ${data.province}, region = ${data.region},
          country = ${data.country}, lat = ${data.lat}, lng = ${data.lng},
          phone = ${data.phone}, email = ${data.email}, website = ${data.website},
          sector = ${data.sector}, legal_status = ${data.legalStatus},
          created_date = ${data.createdDate}::date, status = ${data.status}
        where id = ${data.id}
      `;
    } else {
      await sql`
        update cooperatives set
          name = ${data.name}, description = ${data.description}, address = ${data.address},
          city = ${data.city}, province = ${data.province}, region = ${data.region},
          country = ${data.country}, lat = ${data.lat}, lng = ${data.lng},
          phone = ${data.phone}, email = ${data.email}, website = ${data.website},
          sector = ${data.sector}, legal_status = ${data.legalStatus},
          created_date = ${data.createdDate}::date
        where id = ${data.id}
      `;
    }
    await sql`delete from cooperative_odds where cooperative_id = ${data.id}`;
    for (const code of data.oddCodes) {
      const odd = await sql<{ id: number }>`select id from odds where code = ${code} limit 1`;
      if (odd[0]) {
        await sql`insert into cooperative_odds (cooperative_id, odd_id) values (${data.id}, ${odd[0].id}) on conflict do nothing`;
      }
    }
    await writeAudit(actor.userId, "update", "cooperative", data.id, `Mise à jour de ${data.name}`);
    return { ok: true };
  });

const statsSchema = z.object({
  cooperativeId: z.number(),
  year: z.number(),
  month: z.number().min(1).max(12),
  women: z.number().min(0),
  men: z.number().min(0),
  youth: z.number().min(0),
  adults: z.number().min(0),
  children: z.number().min(0),
  disabled: z.number().min(0),
  indirect: z.number().min(0),
});

export const upsertBeneficiaryStats = createServerFn({ method: "POST" })
  .validator(statsSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const coopId = scopedCoopId(actor, data.cooperativeId);
    if (!coopId || (actor.role === "cooperative" && coopId !== data.cooperativeId)) {
      throw new Error("Accès non autorisé");
    }
    const sql = await getSql();
    await sql`
      insert into beneficiary_stats (
        cooperative_id, year, month, women, men, youth, adults, children, disabled, indirect, updated_at
      ) values (
        ${data.cooperativeId}, ${data.year}, ${data.month},
        ${data.women}, ${data.men}, ${data.youth}, ${data.adults}, ${data.children}, ${data.disabled}, ${data.indirect},
        now()
      )
      on conflict (cooperative_id, year, month) do update set
        women = excluded.women, men = excluded.men, youth = excluded.youth,
        adults = excluded.adults, children = excluded.children, disabled = excluded.disabled,
        indirect = excluded.indirect, updated_at = now()
    `;
    await writeAudit(actor.userId, "update", "beneficiaries", data.cooperativeId, `${data.month}/${data.year}`);
    return { ok: true };
  });

export const listReports = createServerFn({ method: "GET" })
  .validator(z.object({ status: z.string().optional() }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const sid = scopeId(actor);
    const rows = data.status
      ? await sql<ReportRow>`
          select r.*, c.name as cooperative_name
          from reports r join cooperatives c on c.id = r.cooperative_id
          where (${sid}::int is null or r.cooperative_id = ${sid}) and r.status = ${data.status}
          order by r.year desc, r.month desc, r.id desc
        `
      : await sql<ReportRow>`
          select r.*, c.name as cooperative_name
          from reports r join cooperatives c on c.id = r.cooperative_id
          where (${sid}::int is null or r.cooperative_id = ${sid})
          order by r.year desc, r.month desc, r.id desc
        `;
    return rows.map(mapReport);
  });

export const getReport = createServerFn({ method: "GET" })
  .validator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const rows = await sql<ReportRow>`
      select r.*, c.name as cooperative_name from reports r
      join cooperatives c on c.id = r.cooperative_id
      where r.id = ${data.id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Rapport introuvable");
    if (actor.role === "cooperative" && actor.cooperativeId !== row.cooperative_id) {
      throw new Error("Accès non autorisé");
    }
    return mapReport(row);
  });

const reportInput = z.object({
  id: z.number().optional(),
  cooperativeId: z.number(),
  year: z.number(),
  month: z.number().min(1).max(12),
  title: z.string().min(2),
  activitySummary: z.string(),
  achievements: z.string(),
  challenges: z.string(),
  futureActions: z.string(),
  women: z.number().min(0),
  men: z.number().min(0),
  youth: z.number().min(0),
  adults: z.number().min(0),
  children: z.number().min(0),
  disabled: z.number().min(0),
  indirect: z.number().min(0),
  submit: z.boolean(),
});

export const saveReport = createServerFn({ method: "POST" })
  .validator(reportInput)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const coopId = scopedCoopId(actor, data.cooperativeId) ?? data.cooperativeId;
    if (actor.role === "cooperative" && actor.cooperativeId !== coopId) {
      throw new Error("Accès non autorisé");
    }
    const sql = await getSql();
    const status = data.submit ? "submitted" : "draft";
    const submittedAt = data.submit ? new Date().toISOString() : null;
    let id = data.id;
    if (id) {
      await sql`
        update reports set
          title = ${data.title}, activity_summary = ${data.activitySummary},
          achievements = ${data.achievements}, challenges = ${data.challenges},
          future_actions = ${data.futureActions},
          women = ${data.women}, men = ${data.men}, youth = ${data.youth},
          adults = ${data.adults}, children = ${data.children}, disabled = ${data.disabled},
          indirect = ${data.indirect}, year = ${data.year}, month = ${data.month},
          status = ${status}, submitted_at = coalesce(${submittedAt}, submitted_at)
        where id = ${id} and cooperative_id = ${coopId}
      `;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into reports (
          cooperative_id, year, month, title, activity_summary, achievements, challenges, future_actions,
          women, men, youth, adults, children, disabled, indirect, status, submitted_at, created_by
        ) values (
          ${coopId}, ${data.year}, ${data.month}, ${data.title}, ${data.activitySummary},
          ${data.achievements}, ${data.challenges}, ${data.futureActions},
          ${data.women}, ${data.men}, ${data.youth}, ${data.adults}, ${data.children},
          ${data.disabled}, ${data.indirect}, ${status}, ${submittedAt}, ${actor.userId}
        ) returning id
      `;
      id = inserted[0]!.id;
    }
    if (data.submit) {
      await sql`
        insert into notifications (role_target, cooperative_id, type, title, body, href)
        values (
          ${"admin"}, ${coopId}, ${"report_submitted"},
          ${"Rapport mensuel soumis"},
          ${data.title},
          ${`/rapports/${id}`}
        )
      `;
    }
    await writeAudit(actor.userId, data.submit ? "submit" : "save", "report", id ?? 0, data.title);
    return { id };
  });

const reviewSchema = z.object({
  id: z.number(),
  decision: z.enum(["approved", "rejected"]),
  comment: z.string(),
});

export const reviewReport = createServerFn({ method: "POST" })
  .validator(reviewSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const rows = await sql<{ id: number; cooperative_id: number; title: string }>`
      select id, cooperative_id, title from reports where id = ${data.id}
    `;
    const report = rows[0];
    if (!report) throw new Error("Rapport introuvable");
    await sql`
      update reports set status = ${data.decision}, reviewed_at = now(),
        reviewed_by = ${actor.userId}, review_comment = ${data.comment}
      where id = ${data.id}
    `;
    const coopProfile = await sql<{ user_id: string }>`
      select user_id from profiles where cooperative_id = ${report.cooperative_id} and role = 'cooperative'
    `;
    const title = data.decision === "approved" ? "Rapport approuvé" : "Rapport rejeté";
    for (const p of coopProfile) {
      await sql`
        insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
        values (
          ${p.user_id}, ${"cooperative"}, ${report.cooperative_id},
          ${data.decision === "approved" ? "report_approved" : "report_rejected"},
          ${title}, ${data.comment || report.title}, ${`/rapports/${data.id}`}
        )
      `;
    }
    await writeAudit(actor.userId, data.decision, "report", data.id, data.comment);
    return { ok: true };
  });

export const listConventions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const sid = scopeId(actor);
    const rows = await sql<{
      id: number;
      cooperative_id: number;
      cooperative_name: string;
      title: string;
      partner: string;
      start_date: string;
      end_date: string;
      amount: number | string;
      status: "active" | "expiring" | "expired" | "draft";
      description: string;
    }>`
      select v.*, c.name as cooperative_name from conventions v
      join cooperatives c on c.id = v.cooperative_id
      where (${sid}::int is null or v.cooperative_id = ${sid})
      order by v.end_date desc
    `;
    return rows.map(mapConvention);
  });

const conventionSchema = z.object({
  id: z.number().optional(),
  cooperativeId: z.number(),
  title: z.string().min(2),
  partner: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  amount: z.number().min(0),
  description: z.string(),
});

export const saveConvention = createServerFn({ method: "POST" })
  .validator(conventionSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const end = new Date(data.endDate);
    const days = (end.getTime() - Date.now()) / 86400000;
    const status = days < 0 ? "expired" : days < 60 ? "expiring" : "active";
    if (data.id) {
      await sql`
        update conventions set title = ${data.title}, partner = ${data.partner},
          start_date = ${data.startDate}::date, end_date = ${data.endDate}::date,
          amount = ${data.amount}, description = ${data.description}, status = ${status}
        where id = ${data.id}
      `;
      await writeAudit(actor.userId, "update", "convention", data.id, data.title);
      return { id: data.id };
    }
    const inserted = await sql<{ id: number }>`
      insert into conventions (cooperative_id, title, partner, start_date, end_date, amount, status, description)
      values (${data.cooperativeId}, ${data.title}, ${data.partner}, ${data.startDate}::date, ${data.endDate}::date, ${data.amount}, ${status}, ${data.description})
      returning id
    `;
    const id = inserted[0]!.id;
    await writeAudit(actor.userId, "create", "convention", id, data.title);
    return { id };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const sid = scopeId(actor);
    const rows = await sql<{
      id: number;
      cooperative_id: number;
      cooperative_name: string;
      name: string;
      category: string;
      mime_type: string;
      size_bytes: number;
      version: number;
      status: "pending" | "approved" | "rejected";
      owner_user_id: string | null;
      has_content: boolean | number | string | null;
      uploaded_at: string;
    }>`
      select d.id, d.cooperative_id, c.name as cooperative_name, d.name, d.category, d.mime_type,
             d.size_bytes, d.version, d.status, d.owner_user_id,
             (d.content_base64 is not null) as has_content, d.uploaded_at
      from documents d join cooperatives c on c.id = d.cooperative_id
      where (${sid}::int is null or d.cooperative_id = ${sid})
      order by d.uploaded_at desc
    `;
    return rows.map(mapDocument);
  });

const uploadSchema = z.object({
  cooperativeId: z.number(),
  name: z.string().min(1),
  category: z.string().min(1),
  mimeType: z.string().min(1),
  contentBase64: z.string().min(1),
  sizeBytes: z.number(),
});

export const uploadDocument = createServerFn({ method: "POST" })
  .validator(uploadSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const coopId = scopedCoopId(actor, data.cooperativeId) ?? data.cooperativeId;
    if (actor.role === "cooperative" && actor.cooperativeId !== coopId) {
      throw new Error("Accès non autorisé");
    }
    if (data.sizeBytes > MAX_UPLOAD_BYTES) {
      throw new Error("Fichier trop volumineux (max 1,5 Mo)");
    }
    const allowed =
      (ALLOWED_MIME as readonly string[]).includes(data.mimeType) ||
      data.mimeType.startsWith("image/") ||
      data.mimeType === "text/csv" ||
      data.mimeType === "application/pdf";
    if (!allowed) throw new Error("Type de fichier non autorisé");
    const sql = await getSql();
    const existing = await sql<{ version: number }>`
      select version from documents where cooperative_id = ${coopId} and name = ${data.name}
      order by version desc limit 1
    `;
    const version = (existing[0]?.version ?? 0) + 1;
    const inserted = await sql<{ id: number }>`
      insert into documents (
        cooperative_id, name, category, mime_type, size_bytes, version, status, owner_user_id, content_base64
      ) values (
        ${coopId}, ${data.name}, ${data.category}, ${data.mimeType}, ${data.sizeBytes},
        ${version}, ${"pending"}, ${actor.userId}, ${data.contentBase64}
      ) returning id
    `;
    await writeAudit(actor.userId, "upload", "document", inserted[0]!.id, data.name);
    return { id: inserted[0]!.id, version };
  });

export const getDocumentContent = createServerFn({ method: "GET" })
  .validator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      cooperative_id: number;
      name: string;
      mime_type: string;
      content_base64: string | null;
    }>`select cooperative_id, name, mime_type, content_base64 from documents where id = ${data.id}`;
    const row = rows[0];
    if (!row) throw new Error("Document introuvable");
    if (actor.role === "cooperative" && actor.cooperativeId !== row.cooperative_id) {
      throw new Error("Accès non autorisé");
    }
    return { name: row.name, mimeType: row.mime_type, contentBase64: row.content_base64 };
  });

const docReviewSchema = z.object({
  id: z.number(),
  status: z.enum(["approved", "rejected"]),
});

export const reviewDocument = createServerFn({ method: "POST" })
  .validator(docReviewSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const rows = await sql<{ cooperative_id: number; name: string }>`
      select cooperative_id, name from documents where id = ${data.id}
    `;
    const doc = rows[0];
    if (!doc) throw new Error("Document introuvable");
    await sql`update documents set status = ${data.status} where id = ${data.id}`;
    const title = data.status === "approved" ? "Document approuvé" : "Document rejeté";
    await sql`
      insert into notifications (role_target, cooperative_id, type, title, body, href)
      values (
        ${"cooperative"}, ${doc.cooperative_id},
        ${data.status === "approved" ? "document_approved" : "document_rejected"},
        ${title}, ${doc.name}, ${"/documents"}
      )
    `;
    await writeAudit(actor.userId, data.status, "document", data.id, doc.name);
    return { ok: true };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      type: string;
      title: string;
      body: string;
      href: string | null;
      read: boolean;
      created_at: string;
    }>`
      select id, type, title, body, href, read, created_at
      from notifications
      where user_id = ${actor.userId}
         or (user_id is null and role_target = ${actor.role}
             and (${actor.cooperativeId}::int is null or cooperative_id is null or cooperative_id = ${actor.cooperativeId}))
      order by created_at desc
      limit 40
    `;
    return rows.map(mapNotification);
  });

export const markNotificationRead = createServerFn({ method: "POST" })
  .validator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await getActor(context.userId);
    const sql = await getSql();
    await sql`update notifications set read = true where id = ${data.id}`;
    return { ok: true };
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    await sql`update notifications set read = true where user_id = ${actor.userId} or role_target = ${actor.role}`;
    return { ok: true };
  });

export const listOdds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await getActor(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      code: number;
      name_fr: string;
      short_name: string;
      color: string;
      count: number;
    }>`
      select o.id, o.code, o.name_fr, o.short_name, o.color, count(co.cooperative_id)::int as count
      from odds o
      left join cooperative_odds co on co.odd_id = o.id
      group by o.id
      order by o.code
    `;
    return rows.map((r) => ({ ...mapOdd(r), count: parseNumeric(r.count) }));
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    const sql = await getSql();
    const sid = scopeId(actor);

    const byRegion = await sql<{ region: string; count: number; beneficiaries: number }>`
      select c.region, count(*)::int as count,
        coalesce(sum(s.women + s.men),0)::int as beneficiaries
      from cooperatives c
      left join lateral (
        select women, men from beneficiary_stats bs
        where bs.cooperative_id = c.id order by year desc, month desc limit 1
      ) s on true
      where (${sid}::int is null or c.id = ${sid})
      group by c.region
      order by beneficiaries desc
    `;
    const bySector = await sql<{ sector: string; count: number; beneficiaries: number }>`
      select c.sector, count(*)::int as count,
        coalesce(sum(s.women + s.men),0)::int as beneficiaries
      from cooperatives c
      left join lateral (
        select women, men from beneficiary_stats bs
        where bs.cooperative_id = c.id order by year desc, month desc limit 1
      ) s on true
      where (${sid}::int is null or c.id = ${sid})
      group by c.sector
      order by beneficiaries desc
    `;
    const byStatus = await sql<{ status: string; count: number }>`
      select status, count(*)::int as count from cooperatives c
      where (${sid}::int is null or c.id = ${sid})
      group by status
    `;
    const monthly = await sql<{
      year: number;
      month: number;
      women: number;
      men: number;
      youth: number;
      disabled: number;
      indirect: number;
    }>`
      select bs.year, bs.month,
        sum(bs.women)::int as women, sum(bs.men)::int as men, sum(bs.youth)::int as youth,
        sum(bs.disabled)::int as disabled, sum(bs.indirect)::int as indirect
      from beneficiary_stats bs
      where (${sid}::int is null or bs.cooperative_id = ${sid})
      group by bs.year, bs.month
      order by bs.year, bs.month
    `;
    const gender = await sql<{ women: number; men: number }>`
      select coalesce(sum(s.women),0)::int as women, coalesce(sum(s.men),0)::int as men
      from cooperatives c
      left join lateral (
        select women, men from beneficiary_stats bs
        where bs.cooperative_id = c.id order by year desc, month desc limit 1
      ) s on true
      where (${sid}::int is null or c.id = ${sid})
    `;
    return {
      byRegion: byRegion.map((r) => ({
        region: r.region,
        count: parseNumeric(r.count),
        beneficiaries: parseNumeric(r.beneficiaries),
      })),
      bySector: bySector.map((r) => ({
        sector: r.sector,
        count: parseNumeric(r.count),
        beneficiaries: parseNumeric(r.beneficiaries),
      })),
      byStatus: byStatus.map((r) => ({ status: r.status, count: parseNumeric(r.count) })),
      monthly: monthly.map(mapMonth),
      gender: {
        women: parseNumeric(gender[0]?.women),
        men: parseNumeric(gender[0]?.men),
      },
    };
  });

export const listActivity = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      user_id: string | null;
      action: string;
      entity_type: string;
      entity_id: string | null;
      details: string;
      created_at: string;
    }>`
      select id, user_id, action, entity_type, entity_id, details, created_at
      from audit_logs order by created_at desc limit 80
    `;
    return rows.map(mapAudit);
  });

const csvSchema = z.object({ csv: z.string().min(1) });

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c.length)) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some((c) => c.length)) rows.push(row);
  return rows;
}

export const importCooperativesCsv = createServerFn({ method: "POST" })
  .validator(csvSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<CsvImportResult> => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const rows = parseCsv(data.csv);
    if (rows.length < 2) {
      return { inserted: 0, errors: [{ row: 1, message: "Fichier vide ou sans en-tête" }] };
    }
    const header = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
    const idx = (name: string) => header.indexOf(name);
    const required = ["name", "city", "region", "sector"];
    const errors: CsvImportResult["errors"] = [];
    for (const r of required) {
      if (idx(r) < 0) errors.push({ row: 1, message: `Colonne obligatoire manquante : ${r}` });
    }
    if (errors.length) return { inserted: 0, errors };

    let inserted = 0;
    for (let i = 1; i < rows.length; i++) {
      const line = rows[i];
      const get = (name: string, fallback = "") => {
        const j = idx(name);
        return j >= 0 ? (line[j] ?? fallback) : fallback;
      };
      const name = get("name");
      const city = get("city");
      const region = get("region");
      const sector = get("sector");
      if (!name || !city || !region || !sector) {
        errors.push({ row: i + 1, message: "name, city, region et sector sont obligatoires" });
        continue;
      }
      const lat = Number.parseFloat(get("lat", "31.8"));
      const lng = Number.parseFloat(get("lng", "-7.1"));
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        errors.push({ row: i + 1, message: "Coordonnées GPS invalides" });
        continue;
      }
      const statusRaw = get("status", "pending");
      const status = ["active", "pending", "suspended"].includes(statusRaw) ? statusRaw : "pending";
      try {
        await sql`
          insert into cooperatives (
            name, description, address, city, province, region, country, lat, lng,
            phone, email, website, sector, legal_status, status, logo_initials
          ) values (
            ${name}, ${get("description")}, ${get("address")}, ${city},
            ${get("province", city)}, ${region}, ${get("country", "Maroc")},
            ${lat}, ${lng}, ${get("phone")}, ${get("email")}, ${get("website")},
            ${sector}, ${get("legal_status", "Coopérative")}, ${status},
            ${name
              .split(" ")
              .slice(0, 2)
              .map((p) => p[0])
              .join("")
              .toUpperCase()}
          )
        `;
        inserted += 1;
      } catch (err) {
        errors.push({ row: i + 1, message: err instanceof Error ? err.message : "Insertion impossible" });
      }
    }
    await writeAudit(actor.userId, "import", "cooperative", null, `${inserted} coopérative(s) importée(s)`);
    return { inserted, errors };
  });

export const exportCooperatives = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    const rows = await sql.query<CoopRow>(
      `select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       order by c.name`,
    );
    return rows.map((r) => mapCoop(r));
  });

export const sendAdminMessage = createServerFn({ method: "POST" })
  .validator(z.object({ cooperativeId: z.number(), title: z.string().min(2), body: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const actor = await getActor(context.userId);
    assertAdmin(actor);
    const sql = await getSql();
    await sql`
      insert into notifications (role_target, cooperative_id, type, title, body, href)
      values (${"cooperative"}, ${data.cooperativeId}, ${"admin_message"}, ${data.title}, ${data.body}, ${"/tableau"})
    `;
    await writeAudit(actor.userId, "message", "notification", data.cooperativeId, data.title);
    return { ok: true };
  });

export const listFilterOptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await getActor(context.userId);
    const sql = await getSql();
    const regions = await sql<{ region: string }>`select distinct region from cooperatives order by region`;
    const cities = await sql<{ city: string }>`select distinct city from cooperatives order by city`;
    const provinces = await sql<{ province: string }>`select distinct province from cooperatives order by province`;
    const sectors = await sql<{ sector: string }>`select distinct sector from cooperatives order by sector`;
    return {
      regions: regions.map((r) => r.region),
      cities: cities.map((r) => r.city),
      provinces: provinces.map((r) => r.province),
      sectors: sectors.map((r) => r.sector),
    };
  });
