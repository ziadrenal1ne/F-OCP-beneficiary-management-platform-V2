import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date());

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["ADMIN", "COOPERATIVE"] }).notNull(),
  avatarUrl: text("avatar_url"),
  cooperativeId: text("cooperative_id").unique(),
  createdAt: createdAt(),
});

export const cooperatives = sqliteTable("cooperatives", {
  id: id(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull().default("Maroc"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  sector: text("sector").notNull(),
  legalStatus: text("legal_status").notNull(),
  creationDate: integer("creation_date", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["ACTIVE", "PENDING", "SUSPENDED"] }).notNull().default("ACTIVE"),
  logoColor: text("logo_color").notNull().default("#1B4332"),
  createdAt: createdAt(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const odds = sqliteTable("odds", {
  id: id(),
  number: integer("number").notNull().unique(),
  name: text("name").notNull(),
  nameFr: text("name_fr").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const cooperativeOdds = sqliteTable("cooperative_odds", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  oddId: text("odd_id").notNull().references(() => odds.id, { onDelete: "cascade" }),
}, (t) => ({
  uniq: uniqueIndex("coop_odd_uniq").on(t.cooperativeId, t.oddId),
}));

export const beneficiaryRecords = sqliteTable("beneficiary_records", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  women: integer("women").notNull().default(0),
  men: integer("men").notNull().default(0),
  youth: integer("youth").notNull().default(0),
  adults: integer("adults").notNull().default(0),
  children: integer("children").notNull().default(0),
  disabled: integer("disabled").notNull().default(0),
  indirect: integer("indirect").notNull().default(0),
  createdAt: createdAt(),
}, (t) => ({
  uniq: uniqueIndex("beneficiary_period_uniq").on(t.cooperativeId, t.month, t.year),
}));

export const reports = sqliteTable("reports", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  activitySummary: text("activity_summary").notNull(),
  beneficiariesReached: integer("beneficiaries_reached").notNull().default(0),
  achievements: text("achievements").notNull(),
  challenges: text("challenges").notNull(),
  futureActions: text("future_actions").notNull(),
  status: text("status", { enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] }).notNull().default("SUBMITTED"),
  reviewComment: text("review_comment"),
  submittedAt: createdAt(),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
}, (t) => ({
  uniq: uniqueIndex("report_period_uniq").on(t.cooperativeId, t.month, t.year),
}));

export const documents = sqliteTable("documents", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  fileType: text("file_type").notNull(),
  fileSizeKb: integer("file_size_kb").notNull(),
  category: text("category", { enum: ["REPORT", "CONVENTION", "FINANCIAL", "LEGAL", "MEDIA", "OTHER"] }).notNull().default("OTHER"),
  status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).notNull().default("PENDING"),
  version: integer("version").notNull().default(1),
  ownerName: text("owner_name").notNull(),
  storagePath: text("storage_path"),
  uploadedAt: createdAt(),
});

export const conventions = sqliteTable("conventions", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  reference: text("reference").notNull(),
  budget: real("budget").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  status: text("status", { enum: ["ACTIVE", "EXPIRING", "EXPIRED", "DRAFT"] }).notNull().default("ACTIVE"),
  createdAt: createdAt(),
});

export const esgIndicators = sqliteTable("esg_indicators", {
  id: id(),
  cooperativeId: text("cooperative_id").notNull().references(() => cooperatives.id, { onDelete: "cascade" }),
  environmental: integer("environmental").notNull(),
  social: integer("social").notNull(),
  governance: integer("governance").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
}, (t) => ({
  uniq: uniqueIndex("esg_period_uniq").on(t.cooperativeId, t.month, t.year),
}));

export const notifications = sqliteTable("notifications", {
  id: id(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  cooperativeId: text("cooperative_id").references(() => cooperatives.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["REPORT_APPROVED", "REPORT_REJECTED", "REPORT_MISSING", "CONVENTION_EXPIRING", "DOCUMENT_REJECTED", "ADMIN_MESSAGE", "NEW_SUBMISSION"],
  }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: id(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  detail: text("detail"),
  createdAt: createdAt(),
});

// Relations
export const cooperativesRelations = relations(cooperatives, ({ many, one }) => ({
  odds: many(cooperativeOdds),
  beneficiaryRecords: many(beneficiaryRecords),
  reports: many(reports),
  documents: many(documents),
  conventions: many(conventions),
  esgIndicators: many(esgIndicators),
  user: one(users, { fields: [cooperatives.id], references: [users.cooperativeId] }),
}));

export const cooperativeOddsRelations = relations(cooperativeOdds, ({ one }) => ({
  cooperative: one(cooperatives, { fields: [cooperativeOdds.cooperativeId], references: [cooperatives.id] }),
  odd: one(odds, { fields: [cooperativeOdds.oddId], references: [odds.id] }),
}));

export const oddsRelations = relations(odds, ({ many }) => ({
  cooperatives: many(cooperativeOdds),
}));

export const usersRelations = relations(users, ({ one }) => ({
  cooperative: one(cooperatives, { fields: [users.cooperativeId], references: [cooperatives.id] }),
}));
