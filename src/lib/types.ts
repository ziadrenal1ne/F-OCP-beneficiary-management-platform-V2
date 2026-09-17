export type UserRole = "admin" | "cooperative";

export type CooperativeStatus = "active" | "pending" | "suspended";
export type ReportStatus = "draft" | "submitted" | "approved" | "rejected";
export type DocumentStatus = "pending" | "approved" | "rejected";
export type ConventionStatus = "active" | "expiring" | "expired" | "draft";

export type Actor = {
  userId: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  cooperativeId: number | null;
};

export type Odd = {
  id: number;
  code: number;
  nameFr: string;
  shortName: string;
  color: string;
};

export type Cooperative = {
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
  legalStatus: string;
  createdDate: string | null;
  status: CooperativeStatus;
  logoInitials: string;
  women: number;
  men: number;
  youth: number;
  adults: number;
  children: number;
  disabled: number;
  indirect: number;
  totalDirect: number;
  odds: Odd[];
};

export type BeneficiaryMonth = {
  year: number;
  month: number;
  women: number;
  men: number;
  youth: number;
  adults: number;
  children: number;
  disabled: number;
  indirect: number;
};

export type Report = {
  id: number;
  cooperativeId: number;
  cooperativeName: string;
  year: number;
  month: number;
  title: string;
  activitySummary: string;
  achievements: string;
  challenges: string;
  futureActions: string;
  women: number;
  men: number;
  youth: number;
  adults: number;
  children: number;
  disabled: number;
  indirect: number;
  status: ReportStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewComment: string | null;
  createdAt: string;
};

export type Convention = {
  id: number;
  cooperativeId: number;
  cooperativeName: string;
  title: string;
  partner: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: ConventionStatus;
  description: string;
};

export type DocumentRecord = {
  id: number;
  cooperativeId: number;
  cooperativeName: string;
  name: string;
  category: string;
  mimeType: string;
  sizeBytes: number;
  version: number;
  status: DocumentStatus;
  ownerUserId: string | null;
  hasContent: boolean;
  uploadedAt: string;
};

export type EsgIndicator = {
  year: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  waterSavedM3: number;
  renewableEnergyKwh: number;
  jobsCreated: number;
  trainingHours: number;
  notes: string;
};

export type NotificationItem = {
  id: number;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export type AuditLog = {
  id: number;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string;
  createdAt: string;
};

export type DashboardKpis = {
  cooperatives: number;
  beneficiaries: number;
  women: number;
  men: number;
  youth: number;
  disabled: number;
  indirect: number;
  reports: number;
  conventions: number;
  pendingValidations: number;
  documents: number;
};

export type CsvImportError = {
  row: number;
  message: string;
};

export type CsvImportResult = {
  inserted: number;
  errors: CsvImportError[];
};
