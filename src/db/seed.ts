import bcrypt from "bcryptjs";
import { db, sqlite } from "./index";
import {
  users, cooperatives, odds, cooperativeOdds, beneficiaryRecords,
  reports, documents, conventions, esgIndicators, notifications, auditLogs,
} from "./schema";
import { MOROCCAN_CITIES, SECTORS, LEGAL_STATUSES, ODDS_LIST, buildCooperativeNames } from "./seed-data";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: readonly T[]): T {
  return arr[rand(0, arr.length - 1)];
}
function pickMany<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function jitter(v: number, pct: number) {
  return v + v * (Math.random() * pct * 2 - pct);
}

async function main() {
  console.log("Resetting database...");
  sqlite.exec(`
    DELETE FROM audit_logs;
    DELETE FROM notifications;
    DELETE FROM esg_indicators;
    DELETE FROM conventions;
    DELETE FROM documents;
    DELETE FROM reports;
    DELETE FROM beneficiary_records;
    DELETE FROM cooperative_odds;
    DELETE FROM odds;
    DELETE FROM users;
    DELETE FROM cooperatives;
  `);

  console.log("Seeding ODDs...");
  const oddRows = ODDS_LIST.map((o) => ({ ...o }));
  await db.insert(odds).values(oddRows);
  const allOdds = await db.select().from(odds);

  console.log("Seeding cooperatives...");
  const names = buildCooperativeNames(50);
  const now = new Date();
  const cooperativeIds: string[] = [];

  for (let i = 0; i < 50; i++) {
    const cityInfo = MOROCCAN_CITIES[i % MOROCCAN_CITIES.length];
    const sector = pick(SECTORS);
    const creationYear = rand(2008, 2022);
    const statusRoll = Math.random();
    const status = statusRoll < 0.82 ? "ACTIVE" : statusRoll < 0.93 ? "PENDING" : "SUSPENDED";

    const [row] = await db.insert(cooperatives).values({
      name: names[i],
      description: `${names[i]} est une coopérative spécialisée dans le secteur ${sector.toLowerCase()}, active dans la région de ${cityInfo.region} depuis ${creationYear}. Elle regroupe des membres engagés dans le développement local et la valorisation des ressources du territoire.`,
      address: `Douar ${pick(["Ait Melloul", "Sidi Bouzid", "El Menzeh", "Bab Marrakech", "Hay Salam", "Ain Chock"])}, ${cityInfo.city}`,
      city: cityInfo.city,
      province: cityInfo.province,
      region: cityInfo.region,
      country: "Maroc",
      latitude: jitter(cityInfo.lat, 0.05),
      longitude: jitter(cityInfo.lng, 0.05),
      phone: `+212 5${rand(20, 39)}-${rand(100000, 999999)}`,
      email: `contact@${names[i].toLowerCase().replace(/[^a-z0-9]+/g, "")}.ma`,
      website: Math.random() > 0.4 ? `https://www.${names[i].toLowerCase().replace(/[^a-z0-9]+/g, "")}.ma` : null,
      sector,
      legalStatus: pick(LEGAL_STATUSES),
      creationDate: new Date(creationYear, rand(0, 11), rand(1, 28)),
      status: status as "ACTIVE" | "PENDING" | "SUSPENDED",
      logoColor: pick(["#1B4332", "#2D6A4F", "#40916C", "#0F5132", "#14532D", "#166534"]),
    }).returning();

    cooperativeIds.push(row.id);

    // ODDs (2-4 per cooperative)
    const linkedOdds = pickMany(allOdds, rand(2, 4));
    for (const o of linkedOdds) {
      await db.insert(cooperativeOdds).values({ cooperativeId: row.id, oddId: o.id });
    }

    // 12 months of beneficiary history
    let baseWomen = rand(15, 90);
    let baseMen = rand(10, 70);
    for (let m = 11; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      baseWomen = Math.max(5, Math.round(jitter(baseWomen, 0.12) + rand(-2, 4)));
      baseMen = Math.max(3, Math.round(jitter(baseMen, 0.12) + rand(-2, 3)));
      const youth = Math.round((baseWomen + baseMen) * (0.2 + Math.random() * 0.15));
      const disabled = rand(0, 6);
      const indirect = Math.round((baseWomen + baseMen) * (1.5 + Math.random()));
      await db.insert(beneficiaryRecords).values({
        cooperativeId: row.id,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        women: baseWomen,
        men: baseMen,
        youth,
        adults: baseWomen + baseMen - youth > 0 ? baseWomen + baseMen - youth : Math.round((baseWomen + baseMen) * 0.6),
        children: rand(0, 15),
        disabled,
        indirect,
      });
    }

    // ESG indicators per month
    let e = rand(45, 75), s = rand(50, 80), g = rand(40, 70);
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      e = Math.min(98, Math.max(20, Math.round(jitter(e, 0.08))));
      s = Math.min(98, Math.max(20, Math.round(jitter(s, 0.08))));
      g = Math.min(98, Math.max(20, Math.round(jitter(g, 0.08))));
      await db.insert(esgIndicators).values({
        cooperativeId: row.id, environmental: e, social: s, governance: g,
        month: d.getMonth() + 1, year: d.getFullYear(),
      });
    }

    // Monthly reports (last 6 months, some missing to be realistic)
    for (let m = 5; m >= 0; m--) {
      if (Math.random() < 0.12) continue; // simulate a missing report
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const roll = Math.random();
      const rStatus = m === 0 ? "SUBMITTED" : roll < 0.75 ? "APPROVED" : roll < 0.9 ? "SUBMITTED" : "REJECTED";
      await db.insert(reports).values({
        cooperativeId: row.id,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        activitySummary: `Durant ce mois, la coopérative a mené des activités de production et de commercialisation dans le secteur ${sector.toLowerCase()}, avec une participation active des membres.`,
        beneficiariesReached: rand(20, 150),
        achievements: "Augmentation de la production, participation à un salon régional, formation de 5 membres sur les techniques de conditionnement.",
        challenges: "Accès limité au financement, fluctuation des prix des matières premières, besoin d'équipement supplémentaire.",
        futureActions: "Renforcer les capacités techniques, explorer de nouveaux marchés, améliorer la logistique de distribution.",
        status: rStatus as "APPROVED" | "SUBMITTED" | "REJECTED",
        reviewComment: rStatus === "REJECTED" ? "Merci de compléter les indicateurs de bénéficiaires indirects avant resoumission." : rStatus === "APPROVED" ? "Rapport conforme, validé." : null,
        submittedAt: new Date(d.getFullYear(), d.getMonth(), rand(1, 28)),
        reviewedAt: rStatus !== "SUBMITTED" ? new Date(d.getFullYear(), d.getMonth(), rand(1, 28)) : null,
      });
    }

    // Documents
    const docCount = rand(3, 8);
    const categories = ["REPORT", "CONVENTION", "FINANCIAL", "LEGAL", "MEDIA", "OTHER"] as const;
    const docNames = [
      "Rapport_Activite", "Statuts_Cooperative", "Convention_Partenariat", "Bilan_Financier",
      "Photo_Production", "PV_Assemblee_Generale", "Certificat_Bio", "Plan_Action",
    ];
    for (let d = 0; d < docCount; d++) {
      const cat = pick(categories);
      const ext = cat === "MEDIA" ? "jpg" : pick(["pdf", "pdf", "pdf", "xlsx", "csv"]);
      const dStatusRoll = Math.random();
      await db.insert(documents).values({
        cooperativeId: row.id,
        name: `${pick(docNames)}_${row.id.slice(0, 4)}.${ext}`,
        fileType: ext.toUpperCase(),
        fileSizeKb: rand(80, 4200),
        category: cat,
        status: dStatusRoll < 0.7 ? "APPROVED" : dStatusRoll < 0.9 ? "PENDING" : "REJECTED",
        version: rand(1, 3),
        ownerName: names[i],
        uploadedAt: new Date(now.getFullYear(), now.getMonth() - rand(0, 8), rand(1, 28)),
      });
    }

    // Conventions
    const convCount = rand(0, 2);
    for (let c = 0; c < convCount; c++) {
      const start = new Date(creationYear + rand(1, 4), rand(0, 11), 1);
      const durationYears = rand(1, 3);
      const end = new Date(start.getFullYear() + durationYears, start.getMonth(), start.getDate());
      const daysToExpiry = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
      let cStatus: "ACTIVE" | "EXPIRING" | "EXPIRED" | "DRAFT" = "ACTIVE";
      if (daysToExpiry < 0) cStatus = "EXPIRED";
      else if (daysToExpiry < 60) cStatus = "EXPIRING";
      await db.insert(conventions).values({
        cooperativeId: row.id,
        title: `Convention de partenariat ${pick(["Axe Éco-Social", "Appui Technique", "Formation & Renforcement", "Commercialisation"])}`,
        reference: `CONV-${creationYear + rand(1, 4)}-${rand(1000, 9999)}`,
        budget: rand(50, 800) * 1000,
        startDate: start,
        endDate: end,
        status: cStatus,
      });
    }
  }

  console.log("Seeding users...");
  const adminHash = await bcrypt.hash("admin123", 10);
  const coopHash = await bcrypt.hash("cooperative123", 10);

  const [admin] = await db.insert(users).values({
    email: "admin@focp.local",
    passwordHash: adminHash,
    name: "Yasmine El Amrani",
    role: "ADMIN",
  }).returning();

  const demoCoopId = cooperativeIds[0];
  const [coopUser] = await db.insert(users).values({
    email: "cooperative@focp.local",
    passwordHash: coopHash,
    name: "Rachid Benali",
    role: "COOPERATIVE",
    cooperativeId: demoCoopId,
  }).returning();

  console.log("Seeding notifications...");
  const notifTemplates: Array<{ type: any; title: string; message: string }> = [
    { type: "REPORT_APPROVED", title: "Rapport approuvé", message: "Votre rapport mensuel a été validé par l'administrateur." },
    { type: "REPORT_MISSING", title: "Rapport manquant", message: "Le rapport mensuel n'a pas encore été soumis pour ce mois." },
    { type: "CONVENTION_EXPIRING", title: "Convention arrivant à expiration", message: "Une convention arrive à échéance dans moins de 60 jours." },
    { type: "DOCUMENT_REJECTED", title: "Document rejeté", message: "Un document a été rejeté, merci de le mettre à jour." },
    { type: "ADMIN_MESSAGE", title: "Message de l'administration", message: "Merci de vérifier vos indicateurs ESG pour ce trimestre." },
  ];
  for (let i = 0; i < 10; i++) {
    const t = pick(notifTemplates);
    await db.insert(notifications).values({
      userId: admin.id,
      type: t.type,
      title: t.title,
      message: t.message,
      read: Math.random() > 0.6,
      createdAt: new Date(now.getTime() - rand(0, 20) * 86400000),
    });
  }
  for (let i = 0; i < 8; i++) {
    const t = pick(notifTemplates);
    await db.insert(notifications).values({
      userId: coopUser.id,
      cooperativeId: demoCoopId,
      type: t.type,
      title: t.title,
      message: t.message,
      read: Math.random() > 0.5,
      createdAt: new Date(now.getTime() - rand(0, 20) * 86400000),
    });
  }

  await db.insert(auditLogs).values([
    { userId: admin.id, action: "LOGIN", entity: "User", entityId: admin.id, detail: "Connexion administrateur" },
    { userId: admin.id, action: "CREATE", entity: "Cooperative", detail: "Import CSV de 50 coopératives" },
    { userId: coopUser.id, action: "SUBMIT", entity: "Report", detail: "Soumission du rapport mensuel" },
  ]);

  console.log("✅ Seed complete:");
  console.log(`   - ${cooperativeIds.length} cooperatives`);
  console.log(`   - 2 users (admin@focp.local / admin123, cooperative@focp.local / cooperative123)`);
  console.log(`   - Demo cooperative: ${names[0]}`);
}

main().then(() => {
  console.log("Done.");
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
