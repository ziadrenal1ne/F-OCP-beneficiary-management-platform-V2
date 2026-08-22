export const APP_NAME = "Axe Éco-Social";
export const ORG_NAME = "Fondation OCP";

export const DEMO_ACCOUNTS = [
  {
    role: "Administrateur",
    email: "admin@focp.local",
    password: "admin123",
    hint: "Accès complet à la plateforme",
  },
  {
    role: "Représentant coopérative",
    email: "cooperative@focp.local",
    password: "cooperative123",
    hint: "Coopérative Agricole Al Amal — Khouribga",
  },
] as const;

export const SECTORS = [
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
] as const;

export const REGIONS = [
  "Tanger-Tétouan-Al Hoceïma",
  "L'Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
] as const;

export const DOCUMENT_CATEGORIES = [
  "Statuts",
  "Rapport d'activité",
  "Convention",
  "Attestation",
  "Pièce d'identité",
  "Plan d'affaires",
  "Photo",
  "Données CSV",
  "Autre",
] as const;

export const REPORT_STATUSES = [
  { value: "draft", label: "Brouillon" },
  { value: "submitted", label: "Soumis" },
  { value: "approved", label: "Approuvé" },
  { value: "rejected", label: "Rejeté" },
] as const;

export const COOP_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pending", label: "En attente" },
  { value: "suspended", label: "Suspendue" },
] as const;

export const ODDS_CATALOG = [
  { code: 1, nameFr: "Pas de pauvreté", shortName: "Pauvreté", color: "#E5243B" },
  { code: 2, nameFr: "Faim zéro", shortName: "Faim zéro", color: "#DDA63A" },
  { code: 3, nameFr: "Bonne santé et bien-être", shortName: "Santé", color: "#4C9F38" },
  { code: 4, nameFr: "Éducation de qualité", shortName: "Éducation", color: "#C5192D" },
  { code: 5, nameFr: "Égalité entre les sexes", shortName: "Genre", color: "#FF3A21" },
  { code: 6, nameFr: "Eau propre et assainissement", shortName: "Eau", color: "#26BDE2" },
  { code: 7, nameFr: "Énergie propre", shortName: "Énergie", color: "#FCC30B" },
  { code: 8, nameFr: "Travail décent", shortName: "Travail", color: "#A21942" },
  { code: 9, nameFr: "Industrie et innovation", shortName: "Innovation", color: "#FD6925" },
  { code: 10, nameFr: "Inégalités réduites", shortName: "Inégalités", color: "#DD1367" },
  { code: 11, nameFr: "Villes durables", shortName: "Villes", color: "#FD9D24" },
  { code: 12, nameFr: "Consommation responsable", shortName: "Conso.", color: "#BF8B2E" },
  { code: 13, nameFr: "Mesures pour le climat", shortName: "Climat", color: "#3F7E44" },
  { code: 14, nameFr: "Vie aquatique", shortName: "Océans", color: "#0A97D9" },
  { code: 15, nameFr: "Vie terrestre", shortName: "Terre", color: "#56C02B" },
  { code: 16, nameFr: "Paix et justice", shortName: "Paix", color: "#00689D" },
  { code: 17, nameFr: "Partenariats", shortName: "Partenariats", color: "#19486A" },
] as const;

export const MAX_UPLOAD_BYTES = 1_500_000;
export const ALLOWED_MIME = [
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;
