import { r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { S as parseNumeric, t as ALLOWED_MIME, v as getSql } from "./utils-BYOSEtN8.mjs";
import { t as authMiddleware } from "./middleware-Df2gyd2O.mjs";
import { n as ensureSeeded, t as createServerRpc } from "./seed-De06I9Hj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-YTDtyhjc.js
async function getActor(userId) {
	await ensureSeeded();
	const sql = await getSql();
	const user = (await sql`
    select id, email, name from "user" where id = ${userId} limit 1
  `)[0];
	const email = user?.email?.toLowerCase() ?? null;
	const existing = await sql`
    select user_id, role, cooperative_id, display_name from profiles where user_id = ${userId} limit 1
  `;
	if (existing[0]) return {
		userId,
		email,
		name: existing[0].display_name ?? user?.name ?? null,
		role: existing[0].role,
		cooperativeId: existing[0].cooperative_id
	};
	let role = "admin";
	let cooperativeId = null;
	let displayName = user?.name ?? "Utilisateur";
	if (email === "cooperative@focp.local") {
		role = "cooperative";
		displayName = "Représentant Al Amal";
		cooperativeId = (await sql`
      select id from cooperatives where name = ${"Coopérative Agricole Al Amal de Khouribga"} limit 1
    `)[0]?.id ?? null;
		if (!cooperativeId) cooperativeId = (await sql`select id from cooperatives order by id limit 1`)[0]?.id ?? null;
	} else if (email === "admin@focp.local") {
		role = "admin";
		displayName = "Administrateur FOCP";
	} else {
		role = "admin";
		displayName = user?.name || "Administrateur";
	}
	await sql`
    insert into profiles (user_id, role, cooperative_id, display_name)
    values (${userId}, ${role}, ${cooperativeId}, ${displayName})
    on conflict (user_id) do nothing
  `;
	return {
		userId,
		email,
		name: displayName,
		role,
		cooperativeId
	};
}
function assertAdmin(actor) {
	if (actor.role !== "admin") throw new Error("Accès réservé aux administrateurs");
}
function scopedCoopId(actor, requested) {
	if (actor.role === "cooperative") return actor.cooperativeId;
	return requested ?? null;
}
async function writeAudit(userId, action, entityType, entityId, details) {
	await (await getSql())`
    insert into audit_logs (user_id, action, entity_type, entity_id, details)
    values (${userId}, ${action}, ${entityType}, ${entityId == null ? null : String(entityId)}, ${details})
  `;
}
function mapCoop(row, odds = []) {
	const women = parseNumeric(row.women);
	const men = parseNumeric(row.men);
	const youth = parseNumeric(row.youth);
	const adults = parseNumeric(row.adults);
	const children = parseNumeric(row.children);
	const disabled = parseNumeric(row.disabled);
	const indirect = parseNumeric(row.indirect);
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		address: row.address,
		city: row.city,
		province: row.province,
		region: row.region,
		country: row.country,
		lat: Number(row.lat),
		lng: Number(row.lng),
		phone: row.phone,
		email: row.email,
		website: row.website,
		sector: row.sector,
		legalStatus: row.legal_status,
		createdDate: row.created_date,
		status: row.status,
		logoInitials: row.logo_initials,
		women,
		men,
		youth,
		adults,
		children,
		disabled,
		indirect,
		totalDirect: women + men,
		odds
	};
}
var LATEST_STATS_JOIN = `
  left join lateral (
    select women, men, youth, adults, children, disabled, indirect
    from beneficiary_stats bs
    where bs.cooperative_id = c.id
    order by year desc, month desc
    limit 1
  ) s on true
`;
function mapReport(row) {
	return {
		id: row.id,
		cooperativeId: row.cooperative_id,
		cooperativeName: row.cooperative_name,
		year: row.year,
		month: row.month,
		title: row.title,
		activitySummary: row.activity_summary,
		achievements: row.achievements,
		challenges: row.challenges,
		futureActions: row.future_actions,
		women: parseNumeric(row.women),
		men: parseNumeric(row.men),
		youth: parseNumeric(row.youth),
		adults: parseNumeric(row.adults),
		children: parseNumeric(row.children),
		disabled: parseNumeric(row.disabled),
		indirect: parseNumeric(row.indirect),
		status: row.status,
		submittedAt: row.submitted_at,
		reviewedAt: row.reviewed_at,
		reviewedBy: row.reviewed_by,
		reviewComment: row.review_comment,
		createdAt: row.created_at
	};
}
function mapConvention(row) {
	return {
		id: row.id,
		cooperativeId: row.cooperative_id,
		cooperativeName: row.cooperative_name,
		title: row.title,
		partner: row.partner,
		startDate: row.start_date,
		endDate: row.end_date,
		amount: parseNumeric(row.amount),
		status: row.status,
		description: row.description
	};
}
function mapDocument(row) {
	return {
		id: row.id,
		cooperativeId: row.cooperative_id,
		cooperativeName: row.cooperative_name,
		name: row.name,
		category: row.category,
		mimeType: row.mime_type,
		sizeBytes: parseNumeric(row.size_bytes),
		version: parseNumeric(row.version),
		status: row.status,
		ownerUserId: row.owner_user_id,
		hasContent: Boolean(row.has_content),
		uploadedAt: row.uploaded_at
	};
}
function mapNotification(row) {
	return {
		id: row.id,
		type: row.type,
		title: row.title,
		body: row.body,
		href: row.href,
		read: Boolean(row.read),
		createdAt: row.created_at
	};
}
function mapAudit(row) {
	return {
		id: row.id,
		userId: row.user_id,
		action: row.action,
		entityType: row.entity_type,
		entityId: row.entity_id,
		details: row.details,
		createdAt: row.created_at
	};
}
function mapMonth(row) {
	return {
		year: row.year,
		month: row.month,
		women: parseNumeric(row.women),
		men: parseNumeric(row.men),
		youth: parseNumeric(row.youth),
		adults: parseNumeric(row.adults),
		children: parseNumeric(row.children),
		disabled: parseNumeric(row.disabled),
		indirect: parseNumeric(row.indirect)
	};
}
function mapEsg(row) {
	return {
		year: row.year,
		environmentalScore: parseNumeric(row.environmental_score),
		socialScore: parseNumeric(row.social_score),
		governanceScore: parseNumeric(row.governance_score),
		waterSavedM3: parseNumeric(row.water_saved_m3),
		renewableEnergyKwh: parseNumeric(row.renewable_energy_kwh),
		jobsCreated: parseNumeric(row.jobs_created),
		trainingHours: parseNumeric(row.training_hours),
		notes: row.notes
	};
}
function mapOdd(row) {
	return {
		id: row.id,
		code: row.code,
		nameFr: row.name_fr,
		shortName: row.short_name,
		color: row.color
	};
}
var idSchema = object({ id: number() });
function scopeId(actor) {
	return actor.role === "cooperative" ? actor.cooperativeId : null;
}
var getMe_createServerFn_handler = createServerRpc({
	id: "fab582be412d4aab36493208e213f7363bac6537b3bdf3ac06473123fdfb5840",
	name: "getMe",
	filename: "src/lib/server/api.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => getActor(context.userId));
var getDashboard_createServerFn_handler = createServerRpc({
	id: "4303ff2527037c84f7e30b270e3f6e8a6118e8bf6a13e0e3f4d48144dd33a3ab",
	name: "getDashboard",
	filename: "src/lib/server/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const sid = scopeId(actor);
	const k = (await sql`
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
    `)[0];
	const kpis = {
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
		documents: parseNumeric(k?.documents)
	};
	const monthly = await sql`
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
	const odds = await sql`
      select o.code, o.name_fr, o.short_name, o.color, count(*)::int as count
      from cooperative_odds co
      join odds o on o.id = co.odd_id
      where (${sid}::int is null or co.cooperative_id = ${sid})
      group by o.code, o.name_fr, o.short_name, o.color
      order by count desc, o.code
    `;
	const activity = await sql`
      select id, user_id, action, entity_type, entity_id, details, created_at
      from audit_logs
      order by created_at desc
      limit 12
    `;
	const recentReports = await sql`
      select r.*, c.name as cooperative_name
      from reports r
      join cooperatives c on c.id = r.cooperative_id
      where (${sid}::int is null or r.cooperative_id = ${sid})
      order by r.created_at desc
      limit 6
    `;
	const esg = await sql`
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
			count: parseNumeric(o.count)
		})),
		activity: activity.map(mapAudit),
		recentReports: recentReports.map(mapReport),
		esg: esg[0] ? mapEsg(esg[0]) : null
	};
});
var searchSchema = object({
	q: string().optional(),
	region: string().optional(),
	province: string().optional(),
	city: string().optional(),
	country: string().optional(),
	sector: string().optional(),
	status: string().optional(),
	odd: number().optional(),
	minBeneficiaries: number().optional()
});
var listCooperatives_createServerFn_handler = createServerRpc({
	id: "3e84c85b8ce5dfb22ecb726d4fb3c8338860184452a7fcad14cc0925c7ad34e7",
	name: "listCooperatives",
	filename: "src/lib/server/api.ts"
}, (opts) => listCooperatives.__executeServer(opts));
var listCooperatives = createServerFn({ method: "GET" }).validator(searchSchema).middleware([authMiddleware]).handler(listCooperatives_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const params = [];
	const where = ["1=1"];
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
		where.push(`exists (select 1 from cooperative_odds co join odds o on o.id = co.odd_id where co.cooperative_id = c.id and o.code = $${params.length})`);
	}
	if (data.minBeneficiaries && data.minBeneficiaries > 0) {
		params.push(data.minBeneficiaries);
		where.push(`coalesce(s.women,0) + coalesce(s.men,0) >= $${params.length}`);
	}
	const rows = await sql.query(`select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       where ${where.join(" and ")}
       order by c.name`, params);
	const oddRows = await sql`
      select co.cooperative_id, o.id, o.code, o.name_fr, o.short_name, o.color
      from cooperative_odds co join odds o on o.id = co.odd_id
      order by o.code
    `;
	const oddsByCoop = /* @__PURE__ */ new Map();
	for (const o of oddRows) {
		const list = oddsByCoop.get(o.cooperative_id) ?? [];
		list.push(mapOdd(o));
		oddsByCoop.set(o.cooperative_id, list);
	}
	return rows.map((r) => mapCoop(r, oddsByCoop.get(r.id) ?? []));
});
var getCooperative_createServerFn_handler = createServerRpc({
	id: "97303f2107070921ba9203c192edc728625afe30108c6ed4d72cc3ac4c461363",
	name: "getCooperative",
	filename: "src/lib/server/api.ts"
}, (opts) => getCooperative.__executeServer(opts));
var getCooperative = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(getCooperative_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	if (actor.role === "cooperative" && actor.cooperativeId !== data.id) throw new Error("Accès non autorisé à cette coopérative");
	const sql = await getSql();
	const row = (await sql.query(`select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       where c.id = $1`, [data.id]))[0];
	if (!row) throw new Error("Coopérative introuvable");
	const odds = await sql`
      select o.id, o.code, o.name_fr, o.short_name, o.color
      from cooperative_odds co join odds o on o.id = co.odd_id
      where co.cooperative_id = ${data.id}
      order by o.code
    `;
	const months = await sql`
      select year, month, women, men, youth, adults, children, disabled, indirect
      from beneficiary_stats where cooperative_id = ${data.id}
      order by year, month
    `;
	const reports = await sql`
      select r.*, c.name as cooperative_name from reports r
      join cooperatives c on c.id = r.cooperative_id
      where r.cooperative_id = ${data.id}
      order by r.year desc, r.month desc
    `;
	const conventions = await sql`
      select v.*, c.name as cooperative_name from conventions v
      join cooperatives c on c.id = v.cooperative_id
      where v.cooperative_id = ${data.id}
      order by v.end_date desc
    `;
	const documents = await sql`
      select d.id, d.cooperative_id, c.name as cooperative_name, d.name, d.category, d.mime_type,
             d.size_bytes, d.version, d.status, d.owner_user_id,
             (d.content_base64 is not null) as has_content, d.uploaded_at
      from documents d join cooperatives c on c.id = d.cooperative_id
      where d.cooperative_id = ${data.id}
      order by d.uploaded_at desc
    `;
	const esg = await sql`
      select * from esg_indicators where cooperative_id = ${data.id} order by year desc limit 1
    `;
	return {
		cooperative: mapCoop(row, odds.map(mapOdd)),
		months: months.map(mapMonth),
		reports: reports.map(mapReport),
		conventions: conventions.map(mapConvention),
		documents: documents.map(mapDocument),
		esg: esg[0] ? mapEsg(esg[0]) : null
	};
});
var updateCoopSchema = object({
	id: number(),
	name: string().min(2),
	description: string(),
	address: string(),
	city: string().min(1),
	province: string().min(1),
	region: string().min(1),
	country: string().min(1),
	lat: number(),
	lng: number(),
	phone: string(),
	email: string(),
	website: string(),
	sector: string().min(1),
	legalStatus: string(),
	createdDate: string().nullable(),
	status: _enum([
		"active",
		"pending",
		"suspended"
	]),
	oddCodes: array(number())
});
var updateCooperative_createServerFn_handler = createServerRpc({
	id: "ac92eebea4e238ae772f1543dd01f988a6c8362db118ad2ea1ad44f50c2932d2",
	name: "updateCooperative",
	filename: "src/lib/server/api.ts"
}, (opts) => updateCooperative.__executeServer(opts));
var updateCooperative = createServerFn({ method: "POST" }).validator(updateCoopSchema).middleware([authMiddleware]).handler(updateCooperative_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	if (actor.role === "cooperative" && actor.cooperativeId !== data.id) throw new Error("Accès non autorisé");
	const sql = await getSql();
	if (actor.role === "admin") await sql`
        update cooperatives set
          name = ${data.name}, description = ${data.description}, address = ${data.address},
          city = ${data.city}, province = ${data.province}, region = ${data.region},
          country = ${data.country}, lat = ${data.lat}, lng = ${data.lng},
          phone = ${data.phone}, email = ${data.email}, website = ${data.website},
          sector = ${data.sector}, legal_status = ${data.legalStatus},
          created_date = ${data.createdDate}::date, status = ${data.status}
        where id = ${data.id}
      `;
	else await sql`
        update cooperatives set
          name = ${data.name}, description = ${data.description}, address = ${data.address},
          city = ${data.city}, province = ${data.province}, region = ${data.region},
          country = ${data.country}, lat = ${data.lat}, lng = ${data.lng},
          phone = ${data.phone}, email = ${data.email}, website = ${data.website},
          sector = ${data.sector}, legal_status = ${data.legalStatus},
          created_date = ${data.createdDate}::date
        where id = ${data.id}
      `;
	await sql`delete from cooperative_odds where cooperative_id = ${data.id}`;
	for (const code of data.oddCodes) {
		const odd = await sql`select id from odds where code = ${code} limit 1`;
		if (odd[0]) await sql`insert into cooperative_odds (cooperative_id, odd_id) values (${data.id}, ${odd[0].id}) on conflict do nothing`;
	}
	await writeAudit(actor.userId, "update", "cooperative", data.id, `Mise à jour de ${data.name}`);
	return { ok: true };
});
var statsSchema = object({
	cooperativeId: number(),
	year: number(),
	month: number().min(1).max(12),
	women: number().min(0),
	men: number().min(0),
	youth: number().min(0),
	adults: number().min(0),
	children: number().min(0),
	disabled: number().min(0),
	indirect: number().min(0)
});
var upsertBeneficiaryStats_createServerFn_handler = createServerRpc({
	id: "bccca172449649a583c1417b511bc97a1ba87b1437bc82a5428fcaa0486cf194",
	name: "upsertBeneficiaryStats",
	filename: "src/lib/server/api.ts"
}, (opts) => upsertBeneficiaryStats.__executeServer(opts));
var upsertBeneficiaryStats = createServerFn({ method: "POST" }).validator(statsSchema).middleware([authMiddleware]).handler(upsertBeneficiaryStats_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const coopId = scopedCoopId(actor, data.cooperativeId);
	if (!coopId || actor.role === "cooperative" && coopId !== data.cooperativeId) throw new Error("Accès non autorisé");
	await (await getSql())`
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
var listReports_createServerFn_handler = createServerRpc({
	id: "7a270e08e1388422957b0cd9cc31f864a4993fd9526c0d9d42acd57bfad3ac22",
	name: "listReports",
	filename: "src/lib/server/api.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "GET" }).validator(object({ status: string().optional() })).middleware([authMiddleware]).handler(listReports_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const sid = scopeId(actor);
	return (data.status ? await sql`
          select r.*, c.name as cooperative_name
          from reports r join cooperatives c on c.id = r.cooperative_id
          where (${sid}::int is null or r.cooperative_id = ${sid}) and r.status = ${data.status}
          order by r.year desc, r.month desc, r.id desc
        ` : await sql`
          select r.*, c.name as cooperative_name
          from reports r join cooperatives c on c.id = r.cooperative_id
          where (${sid}::int is null or r.cooperative_id = ${sid})
          order by r.year desc, r.month desc, r.id desc
        `).map(mapReport);
});
var getReport_createServerFn_handler = createServerRpc({
	id: "9d9410f2e00438ee77560bedf731cea8f03321f6e9612d24288ad3d83911f23a",
	name: "getReport",
	filename: "src/lib/server/api.ts"
}, (opts) => getReport.__executeServer(opts));
var getReport = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(getReport_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const row = (await (await getSql())`
      select r.*, c.name as cooperative_name from reports r
      join cooperatives c on c.id = r.cooperative_id
      where r.id = ${data.id}
    `)[0];
	if (!row) throw new Error("Rapport introuvable");
	if (actor.role === "cooperative" && actor.cooperativeId !== row.cooperative_id) throw new Error("Accès non autorisé");
	return mapReport(row);
});
var reportInput = object({
	id: number().optional(),
	cooperativeId: number(),
	year: number(),
	month: number().min(1).max(12),
	title: string().min(2),
	activitySummary: string(),
	achievements: string(),
	challenges: string(),
	futureActions: string(),
	women: number().min(0),
	men: number().min(0),
	youth: number().min(0),
	adults: number().min(0),
	children: number().min(0),
	disabled: number().min(0),
	indirect: number().min(0),
	submit: boolean()
});
var saveReport_createServerFn_handler = createServerRpc({
	id: "e8bff06d452226181a4a6ec65d648ae7bb8e7dc83b0bf843daa24a1553b22335",
	name: "saveReport",
	filename: "src/lib/server/api.ts"
}, (opts) => saveReport.__executeServer(opts));
var saveReport = createServerFn({ method: "POST" }).validator(reportInput).middleware([authMiddleware]).handler(saveReport_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const coopId = scopedCoopId(actor, data.cooperativeId) ?? data.cooperativeId;
	if (actor.role === "cooperative" && actor.cooperativeId !== coopId) throw new Error("Accès non autorisé");
	const sql = await getSql();
	const status = data.submit ? "submitted" : "draft";
	const submittedAt = data.submit ? (/* @__PURE__ */ new Date()).toISOString() : null;
	let id = data.id;
	if (id) await sql`
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
	else id = (await sql`
        insert into reports (
          cooperative_id, year, month, title, activity_summary, achievements, challenges, future_actions,
          women, men, youth, adults, children, disabled, indirect, status, submitted_at, created_by
        ) values (
          ${coopId}, ${data.year}, ${data.month}, ${data.title}, ${data.activitySummary},
          ${data.achievements}, ${data.challenges}, ${data.futureActions},
          ${data.women}, ${data.men}, ${data.youth}, ${data.adults}, ${data.children},
          ${data.disabled}, ${data.indirect}, ${status}, ${submittedAt}, ${actor.userId}
        ) returning id
      `)[0].id;
	if (data.submit) await sql`
        insert into notifications (role_target, cooperative_id, type, title, body, href)
        values (
          ${"admin"}, ${coopId}, ${"report_submitted"},
          ${"Rapport mensuel soumis"},
          ${data.title},
          ${`/rapports/${id}`}
        )
      `;
	await writeAudit(actor.userId, data.submit ? "submit" : "save", "report", id ?? 0, data.title);
	return { id };
});
var reviewSchema = object({
	id: number(),
	decision: _enum(["approved", "rejected"]),
	comment: string()
});
var reviewReport_createServerFn_handler = createServerRpc({
	id: "e8cc0560637ce80eedebaf766f6d9d3b3a2693a04088cab9c3b9de24ff0d29eb",
	name: "reviewReport",
	filename: "src/lib/server/api.ts"
}, (opts) => reviewReport.__executeServer(opts));
var reviewReport = createServerFn({ method: "POST" }).validator(reviewSchema).middleware([authMiddleware]).handler(reviewReport_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	assertAdmin(actor);
	const sql = await getSql();
	const report = (await sql`
      select id, cooperative_id, title from reports where id = ${data.id}
    `)[0];
	if (!report) throw new Error("Rapport introuvable");
	await sql`
      update reports set status = ${data.decision}, reviewed_at = now(),
        reviewed_by = ${actor.userId}, review_comment = ${data.comment}
      where id = ${data.id}
    `;
	const coopProfile = await sql`
      select user_id from profiles where cooperative_id = ${report.cooperative_id} and role = 'cooperative'
    `;
	const title = data.decision === "approved" ? "Rapport approuvé" : "Rapport rejeté";
	for (const p of coopProfile) await sql`
        insert into notifications (user_id, role_target, cooperative_id, type, title, body, href)
        values (
          ${p.user_id}, ${"cooperative"}, ${report.cooperative_id},
          ${data.decision === "approved" ? "report_approved" : "report_rejected"},
          ${title}, ${data.comment || report.title}, ${`/rapports/${data.id}`}
        )
      `;
	await writeAudit(actor.userId, data.decision, "report", data.id, data.comment);
	return { ok: true };
});
var listConventions_createServerFn_handler = createServerRpc({
	id: "65dd7482d2fff4d1533861ecbfb63e4c340d9defb207012469e53d9be9003e84",
	name: "listConventions",
	filename: "src/lib/server/api.ts"
}, (opts) => listConventions.__executeServer(opts));
var listConventions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listConventions_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const sid = scopeId(actor);
	return (await sql`
      select v.*, c.name as cooperative_name from conventions v
      join cooperatives c on c.id = v.cooperative_id
      where (${sid}::int is null or v.cooperative_id = ${sid})
      order by v.end_date desc
    `).map(mapConvention);
});
var conventionSchema = object({
	id: number().optional(),
	cooperativeId: number(),
	title: string().min(2),
	partner: string().min(1),
	startDate: string(),
	endDate: string(),
	amount: number().min(0),
	description: string()
});
var saveConvention_createServerFn_handler = createServerRpc({
	id: "673d86d3d5305ae947b4b3889f2459c91f9a5e48ace1e6fd971b496a76acb0d2",
	name: "saveConvention",
	filename: "src/lib/server/api.ts"
}, (opts) => saveConvention.__executeServer(opts));
var saveConvention = createServerFn({ method: "POST" }).validator(conventionSchema).middleware([authMiddleware]).handler(saveConvention_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	assertAdmin(actor);
	const sql = await getSql();
	const days = (new Date(data.endDate).getTime() - Date.now()) / 864e5;
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
	const id = (await sql`
      insert into conventions (cooperative_id, title, partner, start_date, end_date, amount, status, description)
      values (${data.cooperativeId}, ${data.title}, ${data.partner}, ${data.startDate}::date, ${data.endDate}::date, ${data.amount}, ${status}, ${data.description})
      returning id
    `)[0].id;
	await writeAudit(actor.userId, "create", "convention", id, data.title);
	return { id };
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "13ce1eb0a32ad8e6af010d846fb36e91528e9abf5e36fb9c985ac6c89bac9a71",
	name: "listDocuments",
	filename: "src/lib/server/api.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDocuments_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const sid = scopeId(actor);
	return (await sql`
      select d.id, d.cooperative_id, c.name as cooperative_name, d.name, d.category, d.mime_type,
             d.size_bytes, d.version, d.status, d.owner_user_id,
             (d.content_base64 is not null) as has_content, d.uploaded_at
      from documents d join cooperatives c on c.id = d.cooperative_id
      where (${sid}::int is null or d.cooperative_id = ${sid})
      order by d.uploaded_at desc
    `).map(mapDocument);
});
var uploadSchema = object({
	cooperativeId: number(),
	name: string().min(1),
	category: string().min(1),
	mimeType: string().min(1),
	contentBase64: string().min(1),
	sizeBytes: number()
});
var uploadDocument_createServerFn_handler = createServerRpc({
	id: "009f70db1cede45e1f619bbb269336cdba286ce0f32edff9ed41f8fd028483d4",
	name: "uploadDocument",
	filename: "src/lib/server/api.ts"
}, (opts) => uploadDocument.__executeServer(opts));
var uploadDocument = createServerFn({ method: "POST" }).validator(uploadSchema).middleware([authMiddleware]).handler(uploadDocument_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const coopId = scopedCoopId(actor, data.cooperativeId) ?? data.cooperativeId;
	if (actor.role === "cooperative" && actor.cooperativeId !== coopId) throw new Error("Accès non autorisé");
	if (data.sizeBytes > 15e5) throw new Error("Fichier trop volumineux (max 1,5 Mo)");
	if (!(ALLOWED_MIME.includes(data.mimeType) || data.mimeType.startsWith("image/") || data.mimeType === "text/csv" || data.mimeType === "application/pdf")) throw new Error("Type de fichier non autorisé");
	const sql = await getSql();
	const version = ((await sql`
      select version from documents where cooperative_id = ${coopId} and name = ${data.name}
      order by version desc limit 1
    `)[0]?.version ?? 0) + 1;
	const inserted = await sql`
      insert into documents (
        cooperative_id, name, category, mime_type, size_bytes, version, status, owner_user_id, content_base64
      ) values (
        ${coopId}, ${data.name}, ${data.category}, ${data.mimeType}, ${data.sizeBytes},
        ${version}, ${"pending"}, ${actor.userId}, ${data.contentBase64}
      ) returning id
    `;
	await writeAudit(actor.userId, "upload", "document", inserted[0].id, data.name);
	return {
		id: inserted[0].id,
		version
	};
});
var getDocumentContent_createServerFn_handler = createServerRpc({
	id: "8a12cf463a577196e6f990a639c0a033853a836050889b1ea136a2af920de0d1",
	name: "getDocumentContent",
	filename: "src/lib/server/api.ts"
}, (opts) => getDocumentContent.__executeServer(opts));
var getDocumentContent = createServerFn({ method: "GET" }).validator(idSchema).middleware([authMiddleware]).handler(getDocumentContent_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	const row = (await (await getSql())`select cooperative_id, name, mime_type, content_base64 from documents where id = ${data.id}`)[0];
	if (!row) throw new Error("Document introuvable");
	if (actor.role === "cooperative" && actor.cooperativeId !== row.cooperative_id) throw new Error("Accès non autorisé");
	return {
		name: row.name,
		mimeType: row.mime_type,
		contentBase64: row.content_base64
	};
});
var docReviewSchema = object({
	id: number(),
	status: _enum(["approved", "rejected"])
});
var reviewDocument_createServerFn_handler = createServerRpc({
	id: "b5f6a9303fbdfce9799a8ad7902bdcecdc721da4270c973c5668f463b29c6c90",
	name: "reviewDocument",
	filename: "src/lib/server/api.ts"
}, (opts) => reviewDocument.__executeServer(opts));
var reviewDocument = createServerFn({ method: "POST" }).validator(docReviewSchema).middleware([authMiddleware]).handler(reviewDocument_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	assertAdmin(actor);
	const sql = await getSql();
	const doc = (await sql`
      select cooperative_id, name from documents where id = ${data.id}
    `)[0];
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
var listNotifications_createServerFn_handler = createServerRpc({
	id: "c3972ee4d0736a00df2095b11cc29da4af69edc7462b684c3b8b7d301bd86b49",
	name: "listNotifications",
	filename: "src/lib/server/api.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	return (await (await getSql())`
      select id, type, title, body, href, read, created_at
      from notifications
      where user_id = ${actor.userId}
         or (user_id is null and role_target = ${actor.role}
             and (${actor.cooperativeId}::int is null or cooperative_id is null or cooperative_id = ${actor.cooperativeId}))
      order by created_at desc
      limit 40
    `).map(mapNotification);
});
var markNotificationRead_createServerFn_handler = createServerRpc({
	id: "3289f796dee82787777d193a34d9a1512494c2094edf41a620e79c8c1f9ee691",
	name: "markNotificationRead",
	filename: "src/lib/server/api.ts"
}, (opts) => markNotificationRead.__executeServer(opts));
var markNotificationRead = createServerFn({ method: "POST" }).validator(idSchema).middleware([authMiddleware]).handler(markNotificationRead_createServerFn_handler, async ({ context, data }) => {
	await getActor(context.userId);
	await (await getSql())`update notifications set read = true where id = ${data.id}`;
	return { ok: true };
});
var markAllNotificationsRead_createServerFn_handler = createServerRpc({
	id: "cf31e0af240ad6dd920c4f67ac03fe75b32fc612f36a2cd11027e382f879159b",
	name: "markAllNotificationsRead",
	filename: "src/lib/server/api.ts"
}, (opts) => markAllNotificationsRead.__executeServer(opts));
var markAllNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markAllNotificationsRead_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	await (await getSql())`update notifications set read = true where user_id = ${actor.userId} or role_target = ${actor.role}`;
	return { ok: true };
});
var listOdds_createServerFn_handler = createServerRpc({
	id: "7c8aa6b34005042aacd531cdf11949b25cd1658faf4348e72f16abdf4b3ddfb7",
	name: "listOdds",
	filename: "src/lib/server/api.ts"
}, (opts) => listOdds.__executeServer(opts));
var listOdds = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOdds_createServerFn_handler, async ({ context }) => {
	await getActor(context.userId);
	return (await (await getSql())`
      select o.id, o.code, o.name_fr, o.short_name, o.color, count(co.cooperative_id)::int as count
      from odds o
      left join cooperative_odds co on co.odd_id = o.id
      group by o.id
      order by o.code
    `).map((r) => ({
		...mapOdd(r),
		count: parseNumeric(r.count)
	}));
});
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "4cb0c004d1395b50a3d126168a8cdd18353f3971a6159e50c5b1c895a32f7625",
	name: "getAnalytics",
	filename: "src/lib/server/api.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAnalytics_createServerFn_handler, async ({ context }) => {
	const actor = await getActor(context.userId);
	const sql = await getSql();
	const sid = scopeId(actor);
	const byRegion = await sql`
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
	const bySector = await sql`
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
	const byStatus = await sql`
      select status, count(*)::int as count from cooperatives c
      where (${sid}::int is null or c.id = ${sid})
      group by status
    `;
	const monthly = await sql`
      select bs.year, bs.month,
        sum(bs.women)::int as women, sum(bs.men)::int as men, sum(bs.youth)::int as youth,
        sum(bs.disabled)::int as disabled, sum(bs.indirect)::int as indirect
      from beneficiary_stats bs
      where (${sid}::int is null or bs.cooperative_id = ${sid})
      group by bs.year, bs.month
      order by bs.year, bs.month
    `;
	const gender = await sql`
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
			beneficiaries: parseNumeric(r.beneficiaries)
		})),
		bySector: bySector.map((r) => ({
			sector: r.sector,
			count: parseNumeric(r.count),
			beneficiaries: parseNumeric(r.beneficiaries)
		})),
		byStatus: byStatus.map((r) => ({
			status: r.status,
			count: parseNumeric(r.count)
		})),
		monthly: monthly.map(mapMonth),
		gender: {
			women: parseNumeric(gender[0]?.women),
			men: parseNumeric(gender[0]?.men)
		}
	};
});
var listActivity_createServerFn_handler = createServerRpc({
	id: "7d32b995b7686adc44fba1b890e600e13202cea5bed07a301ac72ca15465fdfa",
	name: "listActivity",
	filename: "src/lib/server/api.ts"
}, (opts) => listActivity.__executeServer(opts));
var listActivity = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listActivity_createServerFn_handler, async ({ context }) => {
	assertAdmin(await getActor(context.userId));
	return (await (await getSql())`
      select id, user_id, action, entity_type, entity_id, details, created_at
      from audit_logs order by created_at desc limit 80
    `).map(mapAudit);
});
var csvSchema = object({ csv: string().min(1) });
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = "";
	let inQuotes = false;
	const src = text.replace(/^\uFEFF/, "");
	for (let i = 0; i < src.length; i++) {
		const ch = src[i];
		if (inQuotes) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i++;
				} else inQuotes = false;
			} else cell += ch;
		} else if (ch === "\"") inQuotes = true;
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
var importCooperativesCsv_createServerFn_handler = createServerRpc({
	id: "a0d79630eed99066cb7cd9efd81604e5934f4ce936fdcb7404bb0c18378399bf",
	name: "importCooperativesCsv",
	filename: "src/lib/server/api.ts"
}, (opts) => importCooperativesCsv.__executeServer(opts));
var importCooperativesCsv = createServerFn({ method: "POST" }).validator(csvSchema).middleware([authMiddleware]).handler(importCooperativesCsv_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	assertAdmin(actor);
	const sql = await getSql();
	const rows = parseCsv(data.csv);
	if (rows.length < 2) return {
		inserted: 0,
		errors: [{
			row: 1,
			message: "Fichier vide ou sans en-tête"
		}]
	};
	const header = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
	const idx = (name) => header.indexOf(name);
	const required = [
		"name",
		"city",
		"region",
		"sector"
	];
	const errors = [];
	for (const r of required) if (idx(r) < 0) errors.push({
		row: 1,
		message: `Colonne obligatoire manquante : ${r}`
	});
	if (errors.length) return {
		inserted: 0,
		errors
	};
	let inserted = 0;
	for (let i = 1; i < rows.length; i++) {
		const line = rows[i];
		const get = (name, fallback = "") => {
			const j = idx(name);
			return j >= 0 ? line[j] ?? fallback : fallback;
		};
		const name = get("name");
		const city = get("city");
		const region = get("region");
		const sector = get("sector");
		if (!name || !city || !region || !sector) {
			errors.push({
				row: i + 1,
				message: "name, city, region et sector sont obligatoires"
			});
			continue;
		}
		const lat = Number.parseFloat(get("lat", "31.8"));
		const lng = Number.parseFloat(get("lng", "-7.1"));
		if (Number.isNaN(lat) || Number.isNaN(lng)) {
			errors.push({
				row: i + 1,
				message: "Coordonnées GPS invalides"
			});
			continue;
		}
		const statusRaw = get("status", "pending");
		const status = [
			"active",
			"pending",
			"suspended"
		].includes(statusRaw) ? statusRaw : "pending";
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
            ${name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
          )
        `;
			inserted += 1;
		} catch (err) {
			errors.push({
				row: i + 1,
				message: err instanceof Error ? err.message : "Insertion impossible"
			});
		}
	}
	await writeAudit(actor.userId, "import", "cooperative", null, `${inserted} coopérative(s) importée(s)`);
	return {
		inserted,
		errors
	};
});
var exportCooperatives_createServerFn_handler = createServerRpc({
	id: "790265c9290c4f5d1f17ae9c0527f647c4e3b31393b85826121cfc60b4876f70",
	name: "exportCooperatives",
	filename: "src/lib/server/api.ts"
}, (opts) => exportCooperatives.__executeServer(opts));
var exportCooperatives = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(exportCooperatives_createServerFn_handler, async ({ context }) => {
	assertAdmin(await getActor(context.userId));
	return (await (await getSql()).query(`select c.*, coalesce(s.women,0) as women, coalesce(s.men,0) as men,
              coalesce(s.youth,0) as youth, coalesce(s.adults,0) as adults,
              coalesce(s.children,0) as children, coalesce(s.disabled,0) as disabled,
              coalesce(s.indirect,0) as indirect
       from cooperatives c
       ${LATEST_STATS_JOIN}
       order by c.name`)).map((r) => mapCoop(r));
});
var sendAdminMessage_createServerFn_handler = createServerRpc({
	id: "3edf3a6040b7b881f749800d574b9f017044ad82f7305ffb678959e8ecbda14a",
	name: "sendAdminMessage",
	filename: "src/lib/server/api.ts"
}, (opts) => sendAdminMessage.__executeServer(opts));
var sendAdminMessage = createServerFn({ method: "POST" }).validator(object({
	cooperativeId: number(),
	title: string().min(2),
	body: string().min(1)
})).middleware([authMiddleware]).handler(sendAdminMessage_createServerFn_handler, async ({ context, data }) => {
	const actor = await getActor(context.userId);
	assertAdmin(actor);
	await (await getSql())`
      insert into notifications (role_target, cooperative_id, type, title, body, href)
      values (${"cooperative"}, ${data.cooperativeId}, ${"admin_message"}, ${data.title}, ${data.body}, ${"/tableau"})
    `;
	await writeAudit(actor.userId, "message", "notification", data.cooperativeId, data.title);
	return { ok: true };
});
var listFilterOptions_createServerFn_handler = createServerRpc({
	id: "64b35bce6176730891623e6dd03f83f2df559a3c69cc0cbd798ddcf9d8290ddc",
	name: "listFilterOptions",
	filename: "src/lib/server/api.ts"
}, (opts) => listFilterOptions.__executeServer(opts));
var listFilterOptions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFilterOptions_createServerFn_handler, async ({ context }) => {
	await getActor(context.userId);
	const sql = await getSql();
	const regions = await sql`select distinct region from cooperatives order by region`;
	const cities = await sql`select distinct city from cooperatives order by city`;
	const provinces = await sql`select distinct province from cooperatives order by province`;
	const sectors = await sql`select distinct sector from cooperatives order by sector`;
	return {
		regions: regions.map((r) => r.region),
		cities: cities.map((r) => r.city),
		provinces: provinces.map((r) => r.province),
		sectors: sectors.map((r) => r.sector)
	};
});
//#endregion
export { exportCooperatives_createServerFn_handler, getAnalytics_createServerFn_handler, getCooperative_createServerFn_handler, getDashboard_createServerFn_handler, getDocumentContent_createServerFn_handler, getMe_createServerFn_handler, getReport_createServerFn_handler, importCooperativesCsv_createServerFn_handler, listActivity_createServerFn_handler, listConventions_createServerFn_handler, listCooperatives_createServerFn_handler, listDocuments_createServerFn_handler, listFilterOptions_createServerFn_handler, listNotifications_createServerFn_handler, listOdds_createServerFn_handler, listReports_createServerFn_handler, markAllNotificationsRead_createServerFn_handler, markNotificationRead_createServerFn_handler, reviewDocument_createServerFn_handler, reviewReport_createServerFn_handler, saveConvention_createServerFn_handler, saveReport_createServerFn_handler, sendAdminMessage_createServerFn_handler, updateCooperative_createServerFn_handler, uploadDocument_createServerFn_handler, upsertBeneficiaryStats_createServerFn_handler };
