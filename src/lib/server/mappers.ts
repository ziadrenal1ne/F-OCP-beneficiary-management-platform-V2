import { parseNumeric } from "@/lib/utils";
import type {
  AuditLog,
  BeneficiaryMonth,
  Convention,
  Cooperative,
  DocumentRecord,
  EsgIndicator,
  NotificationItem,
  Odd,
  Report,
} from "@/lib/types";

export type CoopRow = {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  sector: string;
  legal_status: string;
  created_date: string | null;
  status: Cooperative["status"];
  logo_initials: string;
  women: number | string | null;
  men: number | string | null;
  youth: number | string | null;
  adults: number | string | null;
  children: number | string | null;
  disabled: number | string | null;
  indirect: number | string | null;
};

export function mapCoop(row: CoopRow, odds: Odd[] = []): Cooperative {
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
    odds,
  };
}

export const LATEST_STATS_JOIN = `
  left join lateral (
    select women, men, youth, adults, children, disabled, indirect
    from beneficiary_stats bs
    where bs.cooperative_id = c.id
    order by year desc, month desc
    limit 1
  ) s on true
`;

export type ReportRow = {
  id: number;
  cooperative_id: number;
  cooperative_name: string;
  year: number;
  month: number;
  title: string;
  activity_summary: string;
  achievements: string;
  challenges: string;
  future_actions: string;
  women: number;
  men: number;
  youth: number;
  adults: number;
  children: number;
  disabled: number;
  indirect: number;
  status: Report["status"];
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_comment: string | null;
  created_at: string;
};

export function mapReport(row: ReportRow): Report {
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
    createdAt: row.created_at,
  };
}

export function mapConvention(row: {
  id: number;
  cooperative_id: number;
  cooperative_name: string;
  title: string;
  partner: string;
  start_date: string;
  end_date: string;
  amount: number | string;
  status: Convention["status"];
  description: string;
}): Convention {
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
    description: row.description,
  };
}

export function mapDocument(row: {
  id: number;
  cooperative_id: number;
  cooperative_name: string;
  name: string;
  category: string;
  mime_type: string;
  size_bytes: number;
  version: number;
  status: DocumentRecord["status"];
  owner_user_id: string | null;
  has_content: boolean | number | string | null;
  uploaded_at: string;
}): DocumentRecord {
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
    uploadedAt: row.uploaded_at,
  };
}

export function mapNotification(row: {
  id: number;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  created_at: string;
}): NotificationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    href: row.href,
    read: Boolean(row.read),
    createdAt: row.created_at,
  };
}

export function mapAudit(row: {
  id: number;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string;
  created_at: string;
}): AuditLog {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details,
    createdAt: row.created_at,
  };
}

export function mapMonth(row: {
  year: number;
  month: number;
  women: number;
  men: number;
  youth: number;
  adults?: number;
  children?: number;
  disabled: number;
  indirect: number;
}): BeneficiaryMonth {
  return {
    year: row.year,
    month: row.month,
    women: parseNumeric(row.women),
    men: parseNumeric(row.men),
    youth: parseNumeric(row.youth),
    adults: parseNumeric(row.adults),
    children: parseNumeric(row.children),
    disabled: parseNumeric(row.disabled),
    indirect: parseNumeric(row.indirect),
  };
}

export function mapEsg(row: {
  year: number;
  environmental_score: number | string;
  social_score: number | string;
  governance_score: number | string;
  water_saved_m3: number;
  renewable_energy_kwh: number;
  jobs_created: number;
  training_hours: number;
  notes: string;
}): EsgIndicator {
  return {
    year: row.year,
    environmentalScore: parseNumeric(row.environmental_score),
    socialScore: parseNumeric(row.social_score),
    governanceScore: parseNumeric(row.governance_score),
    waterSavedM3: parseNumeric(row.water_saved_m3),
    renewableEnergyKwh: parseNumeric(row.renewable_energy_kwh),
    jobsCreated: parseNumeric(row.jobs_created),
    trainingHours: parseNumeric(row.training_hours),
    notes: row.notes,
  };
}

export function mapOdd(row: { id: number; code: number; name_fr: string; short_name: string; color: string }): Odd {
  return {
    id: row.id,
    code: row.code,
    nameFr: row.name_fr,
    shortName: row.short_name,
    color: row.color,
  };
}
