import { randomBytes } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { getSql } from "@/lib/db";
import { ODDS_CATALOG } from "@/lib/constants";
import { initials } from "@/lib/utils";

const globalRef = globalThis as typeof globalThis & {
  __focpSeedPromise__?: Promise<void>;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CITIES = [
  { city: "Rabat", province: "Rabat", region: "Rabat-Salé-Kénitra", lat: 34.0209, lng: -6.8416 },
  { city: "Salé", province: "Salé", region: "Rabat-Salé-Kénitra", lat: 34.0531, lng: -6.7985 },
  { city: "Kénitra", province: "Kénitra", region: "Rabat-Salé-Kénitra", lat: 34.261, lng: -6.5802 },
  { city: "Casablanca", province: "Casablanca", region: "Casablanca-Settat", lat: 33.5731, lng: -7.5898 },
  { city: "Settat", province: "Settat", region: "Casablanca-Settat", lat: 33.001, lng: -7.6166 },
  { city: "El Jadida", province: "El Jadida", region: "Casablanca-Settat", lat: 33.2316, lng: -8.5007 },
  { city: "Berrechid", province: "Berrechid", region: "Casablanca-Settat", lat: 33.2655, lng: -7.5875 },
  { city: "Marrakech", province: "Marrakech", region: "Marrakech-Safi", lat: 31.6295, lng: -7.9811 },
  { city: "Safi", province: "Safi", region: "Marrakech-Safi", lat: 32.2994, lng: -9.2372 },
  { city: "Essaouira", province: "Essaouira", region: "Marrakech-Safi", lat: 31.5085, lng: -9.7595 },
  { city: "Youssoufia", province: "Youssoufia", region: "Marrakech-Safi", lat: 32.2463, lng: -8.5294 },
  { city: "Fès", province: "Fès", region: "Fès-Meknès", lat: 34.0181, lng: -5.0078 },
  { city: "Meknès", province: "Meknès", region: "Fès-Meknès", lat: 33.8935, lng: -5.5547 },
  { city: "Ifrane", province: "Ifrane", region: "Fès-Meknès", lat: 33.5326, lng: -5.1078 },
  { city: "Taza", province: "Taza", region: "Fès-Meknès", lat: 34.214, lng: -4.0088 },
  { city: "Agadir", province: "Agadir", region: "Souss-Massa", lat: 30.4278, lng: -9.5981 },
  { city: "Taroudant", province: "Taroudant", region: "Souss-Massa", lat: 30.4703, lng: -8.877 },
  { city: "Tiznit", province: "Tiznit", region: "Souss-Massa", lat: 29.6974, lng: -9.7316 },
  { city: "Tanger", province: "Tanger-Assilah", region: "Tanger-Tétouan-Al Hoceïma", lat: 35.7595, lng: -5.834 },
  { city: "Tétouan", province: "Tétouan", region: "Tanger-Tétouan-Al Hoceïma", lat: 35.5889, lng: -5.3626 },
  { city: "Chefchaouen", province: "Chefchaouen", region: "Tanger-Tétouan-Al Hoceïma", lat: 35.1688, lng: -5.2636 },
  { city: "Al Hoceïma", province: "Al Hoceïma", region: "Tanger-Tétouan-Al Hoceïma", lat: 35.2517, lng: -3.9371 },
  { city: "Oujda", province: "Oujda-Angad", region: "L'Oriental", lat: 34.6814, lng: -1.9086 },
  { city: "Nador", province: "Nador", region: "L'Oriental", lat: 35.1681, lng: -2.9334 },
  { city: "Berkane", province: "Berkane", region: "L'Oriental", lat: 34.92, lng: -2.32 },
  { city: "Khouribga", province: "Khouribga", region: "Béni Mellal-Khénifra", lat: 32.8811, lng: -6.9063 },
  { city: "Béni Mellal", province: "Béni Mellal", region: "Béni Mellal-Khénifra", lat: 32.3373, lng: -6.3498 },
  { city: "Khénifra", province: "Khénifra", region: "Béni Mellal-Khénifra", lat: 32.9391, lng: -5.667 },
  { city: "Benguerir", province: "Rehamna", region: "Marrakech-Safi", lat: 32.2366, lng: -7.9541 },
  { city: "Ouarzazate", province: "Ouarzazate", region: "Drâa-Tafilalet", lat: 30.9335, lng: -6.937 },
  { city: "Errachidia", province: "Errachidia", region: "Drâa-Tafilalet", lat: 31.9314, lng: -4.4244 },
  { city: "Zagora", province: "Zagora", region: "Drâa-Tafilalet", lat: 30.3324, lng: -5.838 },
  { city: "Guelmim", province: "Guelmim", region: "Guelmim-Oued Noun", lat: 28.987, lng: -10.0574 },
  { city: "Tan-Tan", province: "Tan-Tan", region: "Guelmim-Oued Noun", lat: 28.4378, lng: -11.1031 },
  { city: "Laâyoune", province: "Laâyoune", region: "Laâyoune-Sakia El Hamra", lat: 27.1253, lng: -13.1625 },
  { city: "Dakhla", province: "Oued Ed-Dahab", region: "Dakhla-Oued Ed-Dahab", lat: 23.6848, lng: -15.958 },
  { city: "Sidi Ifni", province: "Sidi Ifni", region: "Guelmim-Oued Noun", lat: 29.3797, lng: -10.1728 },
  { city: "Azilal", province: "Azilal", region: "Béni Mellal-Khénifra", lat: 31.9616, lng: -6.5711 },
] as const;

const NAMES = [
  "Coopérative Agricole Al Amal de Khouribga",
  "Coopérative Féminine Tissir d'Essaouira",
  "Coopérative Arganière Targanine",
  "Coopérative Apicole Atlas d'Ifrane",
  "Coopérative des Tisseuses de Chefchaouen",
  "Coopérative Maraîchère Al Baraka de Berkane",
  "Coopérative de Pêche Artisanale de Dakhla",
  "Coopérative Laitière Al Falah de Meknès",
  "Coopérative d'Écotourisme du Drâa",
  "Coopérative Solaire Tamaynut de Taroudant",
  "Coopérative des Roses de Kelaat M'Gouna",
  "Coopérative Textile Al Amal de Fès",
  "Coopérative des Dattes de Zagora",
  "Coopérative Olive Verte de Taza",
  "Coopérative des Femmes de Youssoufia",
  "Coopérative Halieutique de Safi",
  "Coopérative Agricole Al Khair de Benguerir",
  "Coopérative Artisanale de Tétouan",
  "Coopérative Safran de Taliouine",
  "Coopérative des Amandes d'Azilal",
  "Coopérative Caprine du Moyen Atlas",
  "Coopérative des Algues de Sidi Ifni",
  "Coopérative Éco-Phosphate de Khouribga",
  "Coopérative des Jardins de Salé",
  "Coopérative Céréalière de Settat",
  "Coopérative des Poteries de Safi",
  "Coopérative Miel de l'Oriental",
  "Coopérative des Palmiers de Laâyoune",
  "Coopérative des Femmes Rurales de Khénifra",
  "Coopérative Aquacole de Nador",
  "Coopérative des Herbes Aromatiques de Tiznit",
  "Coopérative Citrus de Berkane",
  "Coopérative des Tapis de Rabat",
  "Coopérative Légumière de Kénitra",
  "Coopérative des Figues de Taounate",
  "Coopérative Énergie Verte d'Agadir",
  "Coopérative des Femmes de Casablanca-Hay Mohammadi",
  "Coopérative des Dromadaires de Tan-Tan",
  "Coopérative des Amlou d'Agadir",
  "Coopérative Forestière d'Ifrane",
  "Coopérative des Huiles d'Olive de Meknès",
  "Coopérative des Jeunes de Béni Mellal",
  "Coopérative des Pêcheurs d'Al Hoceïma",
  "Coopérative des Semences Paysannes de Fès",
  "Coopérative Cosmétique Argan d'Essaouira",
  "Coopérative des Femmes de Guelmim",
  "Coopérative des Jardins Oasiens d'Errachidia",
  "Coopérative Recyclage Vert de Casablanca",
  "Coopérative des Amandiers de Taza",
  "Coopérative des Femmes Artisanes d'Oujda",
];

const SECTORS = [
  "Agriculture",
  "Arganiculture",
  "Artisanat",
  "Pêche artisanale",
  "Élevage",
  "Apiculture",
  "Transformation alimentaire",
  "Écotourisme",
  "Énergie renouvelable",
  "Économie circulaire",
  "Cosmétique naturel",
  "Textile",
  "Eau et assainissement",
];

const DESCRIPTIONS = [
  "Coopérative engagée dans une production durable et l'inclusion des femmes rurales.",
  "Structure d'économie sociale et solidaire accompagnée par la Fondation OCP.",
  "Organisation de producteurs visant la valorisation des filières locales.",
  "Initiative communautaire pour l'emploi des jeunes et l'adaptation climatique.",
  "Groupement à vocation sociale, environnementale et économique dans son territoire.",
];

async function seedUsers(sql: Awaited<ReturnType<typeof getSql>>) {
  const accounts = [
    { email: "admin@focp.local", password: "admin123", name: "Administrateur FOCP" },
    { email: "cooperative@focp.local", password: "cooperative123", name: "Représentant Al Amal" },
  ];
  for (const acc of accounts) {
    const existing = await sql<{ id: string }>`select id from "user" where email = ${acc.email} limit 1`;
    if (existing[0]) continue;
    const userId = randomBytes(16).toString("hex");
    const accountId = randomBytes(16).toString("hex");
    const hashed = await hashPassword(acc.password);
    await sql`
      insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
      values (${userId}, ${acc.name}, ${acc.email}, true, now(), now())
    `;
    await sql`
      insert into "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
      values (${accountId}, ${acc.email}, ${"credential"}, ${userId}, ${hashed}, now(), now())
    `;
  }
}

async function runSeed() {
  const sql = await getSql();
  const already = await sql<{ id: number }>`select id from seed_meta where id = 1`;
  if (already[0]) {
    await seedUsers(sql);
    return;
  }

  for (const odd of ODDS_CATALOG) {
    await sql`
      insert into odds (code, name_fr, short_name, color)
      values (${odd.code}, ${odd.nameFr}, ${odd.shortName}, ${odd.color})
      on conflict (code) do nothing
    `;
  }
  const oddRows = await sql<{ id: number; code: number }>`select id, code from odds order by code`;

  const now = new Date();
  const coopIds: number[] = [];

  for (let i = 0; i < NAMES.length; i++) {
    const rng = mulberry32(1000 + i * 17);
    const loc = CITIES[i % CITIES.length];
    const jitterLat = (rng() - 0.5) * 0.12;
    const jitterLng = (rng() - 0.5) * 0.12;
    const sector = SECTORS[i % SECTORS.length];
    const statusRoll = rng();
    const status = statusRoll > 0.92 ? "suspended" : statusRoll > 0.82 ? "pending" : "active";
    const year = 2008 + Math.floor(rng() * 16);
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 27);
    const createdDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const name = NAMES[i];
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 18);
    const email = `contact.${slug || "coop"}${i}@focp.ma`;
    const phone = `+212 5${Math.floor(20 + rng() * 70)} ${String(Math.floor(rng() * 9000000 + 1000000)).slice(0, 7)}`;
    const website = rng() > 0.35 ? `https://www.${slug || "coop"}.ma` : "";
    const legal = rng() > 0.2 ? "Coopérative" : "Union de coopératives";
    const desc = `${DESCRIPTIONS[i % DESCRIPTIONS.length]} Basée à ${loc.city}, elle intervient principalement en ${sector.toLowerCase()}.`;

    const inserted = await sql<{ id: number }>`
      insert into cooperatives (
        name, description, address, city, province, region, country,
        lat, lng, phone, email, website, sector, legal_status, created_date, status, logo_initials
      ) values (
        ${name}, ${desc},
        ${`${10 + Math.floor(rng() * 80)} rue ${loc.city}`},
        ${loc.city}, ${loc.province}, ${loc.region}, ${"Maroc"},
        ${loc.lat + jitterLat}, ${loc.lng + jitterLng},
        ${phone}, ${email}, ${website}, ${sector}, ${legal},
        ${createdDate}::date, ${status}, ${initials(name)}
      ) returning id
    `;
    const coopId = inserted[0]!.id;
    coopIds.push(coopId);

    const oddCount = 2 + Math.floor(rng() * 4);
    const shuffled = [...oddRows].sort(() => rng() - 0.5).slice(0, oddCount);
    for (const o of shuffled) {
      await sql`insert into cooperative_odds (cooperative_id, odd_id) values (${coopId}, ${o.id}) on conflict do nothing`;
    }

    let women = 40 + Math.floor(rng() * 180);
    let men = 20 + Math.floor(rng() * 140);
    let youth = 15 + Math.floor(rng() * 90);
    let adults = 30 + Math.floor(rng() * 160);
    let children = 8 + Math.floor(rng() * 50);
    let disabled = 2 + Math.floor(rng() * 18);
    let indirect = 80 + Math.floor(rng() * 400);

    const statValues: string[] = [];
    const statParams: unknown[] = [];
    for (let m = 11; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const growth = 1 + (rng() * 0.04 - 0.005);
      women = Math.max(10, Math.round(women * growth));
      men = Math.max(8, Math.round(men * growth));
      youth = Math.max(5, Math.round(youth * growth));
      adults = Math.max(12, Math.round(adults * growth));
      children = Math.max(2, Math.round(children * (1 + (rng() * 0.03 - 0.01))));
      disabled = Math.max(1, Math.round(disabled * (1 + rng() * 0.02)));
      indirect = Math.max(20, Math.round(indirect * growth));
      const base = statParams.length;
      statValues.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10})`);
      statParams.push(coopId, d.getFullYear(), d.getMonth() + 1, women, men, youth, adults, children, disabled, indirect);
    }
    await sql.query(
      `insert into beneficiary_stats (
        cooperative_id, year, month, women, men, youth, adults, children, disabled, indirect
      ) values ${statValues.join(",")} on conflict (cooperative_id, year, month) do nothing`,
      statParams,
    );

    const reportCount = 3 + Math.floor(rng() * 3);
    for (let r = 0; r < reportCount; r++) {
      const d = new Date(now.getFullYear(), now.getMonth() - r, 1);
      const statusRollR = rng();
      let rStatus = "approved";
      if (r === 0 && rng() > 0.4) rStatus = "submitted";
      else if (statusRollR > 0.88) rStatus = "rejected";
      else if (statusRollR > 0.78) rStatus = "draft";
      const submitted = rStatus === "draft" ? null : d.toISOString();
      await sql`
        insert into reports (
          cooperative_id, year, month, title, activity_summary, achievements, challenges, future_actions,
          women, men, youth, adults, children, disabled, indirect, status, submitted_at, created_at
        ) values (
          ${coopId}, ${d.getFullYear()}, ${d.getMonth() + 1},
          ${`Rapport ${d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`},
          ${`Activités de ${sector.toLowerCase()} menées à ${loc.city} avec les membres de la coopérative.`},
          ${"Sessions de formation, commercialisation groupée et suivi des bénéficiaires."},
          ${rng() > 0.5 ? "Accès limité à l'eau d'irrigation et volatilité des prix." : "Logistique de transport et besoin en équipements."},
          ${"Renforcer la gouvernance, étendre les formations et digitaliser le suivi."},
          ${women}, ${men}, ${youth}, ${adults}, ${children}, ${disabled}, ${indirect},
          ${rStatus}, ${submitted}, ${d.toISOString()}
        )
      `;
    }

    const convCount = 1 + Math.floor(rng() * 3);
    for (let c = 0; c < convCount; c++) {
      const start = new Date(now.getFullYear() - 1, Math.floor(rng() * 12), 1);
      const end = new Date(start.getFullYear() + 1, start.getMonth() + 6 + Math.floor(rng() * 8), 1);
      const daysLeft = (end.getTime() - now.getTime()) / 86400000;
      const cStatus = daysLeft < 0 ? "expired" : daysLeft < 60 ? "expiring" : "active";
      const amount = (80 + Math.floor(rng() * 420)) * 1000;
      await sql`
        insert into conventions (
          cooperative_id, title, partner, start_date, end_date, amount, status, description
        ) values (
          ${coopId},
          ${`Convention d'accompagnement ${sector}`},
          ${c % 2 === 0 ? "Fondation OCP" : "OCP Group — Axe Éco-Social"},
          ${start.toISOString().slice(0, 10)}::date,
          ${end.toISOString().slice(0, 10)}::date,
          ${amount}, ${cStatus},
          ${"Appui technique, formation et financement de l'équipement productif."}
        )
      `;
    }

    const docs = [
      { name: "Statuts de la coopérative.pdf", category: "Statuts", mime: "application/pdf", status: "approved" },
      { name: "Rapport d'activité 2025.pdf", category: "Rapport d'activité", mime: "application/pdf", status: rng() > 0.3 ? "approved" : "pending" },
      { name: "Liste des membres.csv", category: "Données CSV", mime: "text/csv", status: "approved" },
    ];
    if (rng() > 0.5) {
      docs.push({
        name: "Photo atelier.jpg",
        category: "Photo",
        mime: "image/jpeg",
        status: "pending",
      });
    }
    for (const doc of docs) {
      await sql`
        insert into documents (
          cooperative_id, name, category, mime_type, size_bytes, version, status, content_base64
        ) values (
          ${coopId}, ${doc.name}, ${doc.category}, ${doc.mime},
          ${12_000 + Math.floor(rng() * 80_000)}, 1, ${doc.status}, null
        )
      `;
    }

    const env = 55 + rng() * 40;
    const soc = 60 + rng() * 35;
    const gov = 50 + rng() * 40;
    await sql`
      insert into esg_indicators (
        cooperative_id, year, environmental_score, social_score, governance_score,
        water_saved_m3, renewable_energy_kwh, jobs_created, training_hours, notes
      ) values (
        ${coopId}, ${now.getFullYear()},
        ${env.toFixed(1)}, ${soc.toFixed(1)}, ${gov.toFixed(1)},
        ${Math.floor(200 + rng() * 4000)}, ${Math.floor(100 + rng() * 8000)},
        ${Math.floor(4 + rng() * 40)}, ${Math.floor(40 + rng() * 600)},
        ${"Indicateurs ESG auto-évalués et consolidés par l'équipe Axe Éco-Social."}
      )
    `;
  }

  await seedUsers(sql);

  const admin = await sql<{ id: string }>`select id from "user" where email = ${"admin@focp.local"} limit 1`;
  const coopUser = await sql<{ id: string }>`select id from "user" where email = ${"cooperative@focp.local"} limit 1`;
  const firstCoop = coopIds[0] ?? null;

  if (admin[0]) {
    await sql`
      insert into profiles (user_id, role, cooperative_id, display_name)
      values (${admin[0].id}, ${"admin"}, null, ${"Administrateur FOCP"})
      on conflict (user_id) do nothing
    `;
  }
  if (coopUser[0]) {
    await sql`
      insert into profiles (user_id, role, cooperative_id, display_name)
      values (${coopUser[0].id}, ${"cooperative"}, ${firstCoop}, ${"Représentant Al Amal"})
      on conflict (user_id) do nothing
    `;
  }

  const pendingReports = await sql<{ id: number; cooperative_id: number }>`
    select id, cooperative_id from reports where status = 'submitted' limit 8
  `;
  for (const r of pendingReports) {
    await sql`
      insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
      values (
        ${admin[0]?.id ?? null}, ${"admin"}, ${r.cooperative_id}, ${"report_submitted"},
        ${"Rapport mensuel à valider"},
        ${"Une coopérative a soumis un rapport d'activité en attente de revue."},
        ${`/rapports/${r.id}`}
      )
    `;
  }

  const expiring = await sql<{ id: number; cooperative_id: number; title: string }>`
    select id, cooperative_id, title from conventions where status = 'expiring' limit 6
  `;
  for (const c of expiring) {
    await sql`
      insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
      values (
        ${admin[0]?.id ?? null}, ${"admin"}, ${c.cooperative_id}, ${"convention_expiring"},
        ${"Convention bientôt échue"},
        ${c.title},
        ${"/conventions"}
      )
    `;
  }

  if (coopUser[0] && firstCoop) {
    await sql`
      insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
      values (
        ${coopUser[0].id}, ${"cooperative"}, ${firstCoop}, ${"missing_report"},
        ${"Rapport mensuel à déposer"},
        ${"Pensez à soumettre le rapport du mois en cours."},
        ${"/rapports/nouveau"}
      )
    `;
    await sql`
      insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
      values (
        ${coopUser[0].id}, ${"cooperative"}, ${firstCoop}, ${"admin_message"},
        ${"Message de l'administrateur"},
        ${"Merci de mettre à jour les statistiques de bénéficiaires avant la revue trimestrielle."},
        ${"/beneficiaires"}
      )
    `;
  }

  await sql`
    insert into audit_logs (user_id, action, entity_type, entity_id, details)
    values (
      ${admin[0]?.id ?? null}, ${"seed"}, ${"system"}, ${"1"},
      ${"Initialisation de la plateforme avec 50 coopératives marocaines."}
    )
  `;

  await sql`insert into seed_meta (id) values (1) on conflict (id) do nothing`;
}

export function ensureSeeded(): Promise<void> {
  globalRef.__focpSeedPromise__ ??= runSeed().catch((err) => {
    globalRef.__focpSeedPromise__ = undefined;
    throw err;
  });
  return globalRef.__focpSeedPromise__;
}
