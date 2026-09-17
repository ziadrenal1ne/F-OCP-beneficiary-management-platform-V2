<<<<<<< HEAD
<div align="center">

# 🌿 F-OCP — Beneficiary Management Platform

**A full-stack platform for managing beneficiary data across 1,700+ Moroccan cooperatives.**

Cooperative profiles · Beneficiary tracking · ESG & ODD indicators · Interactive mapping · Reporting workflows · Exports

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![License](https://img.shields.io/badge/license-MIT-informational?style=flat-square)](#license)

</div>

---

## Overview

**F-OCP** centralizes everything a national cooperative network needs to track its social and economic impact: cooperative profiles, monthly beneficiary counts, ESG indicators, ODD (Sustainable Development Goal) alignment, monthly activity reports, supporting documents, and partnership conventions — all in one place, with an administrator view for oversight and validation, and a cooperative-facing view scoped to a single organization.

This repository ships as a working MVP, seeded with **50 realistic Moroccan cooperatives** spread across 30 cities, complete with 12 months of historical data — not a static prototype with placeholder screens.

<br>

<div align="center">
  <!-- Replace with real screenshots once you have them -->
  <img src="docs/screenshot-dashboard.png" width="49%" alt="Admin dashboard" />
  <img src="docs/screenshot-map.png" width="49%" alt="Interactive map" />
</div>

<sub>💡 Add your own screenshots to a `docs/` folder and update the paths above — see [Screenshots](#screenshots).</sub>

---

## ✨ Features

| Module | What it does |
|---|---|
| 🔐 **Authentication** | Role-based login (Admin / Cooperative), protected routes, persistent sessions |
| 📊 **Admin dashboard** | Network-wide KPIs, beneficiary evolution, ODD distribution, pending validations |
| 🏢 **Cooperative dashboard** | Scoped view of one cooperative's stats, reports, and documents |
| 📝 **Cooperative profiles** | Full organizational info — location, sector, legal status, contacts |
| 👥 **Beneficiary tracking** | Monthly counts (women, men, youth, disabled, indirect), historical trends |
| 📄 **Monthly reporting** | Cooperatives submit activity reports; admins approve or reject with comments |
| 📁 **Document management** | Upload, categorize, version, and review supporting documents |
| 📥 **CSV import** | Bulk-import cooperatives with row-level validation and error reporting |
| 🗺️ **Interactive map** | Leaflet-powered map of every cooperative, filterable by region / sector / ODD |
| 🎯 **ODD tracking** | Multi-ODD tagging per cooperative with network-wide distribution charts |
| ✅ **Validation workflow** | Submit → notify → review → approve/reject → notify, end to end |
| 🔎 **Advanced search** | Filter by name, region, province, sector, status, or ODD |
| 🔔 **Notifications** | Event-driven alerts (report approved, convention expiring, etc.) |
| 📈 **Analytics** | Bar, pie, area, and trend charts across the full network |
| ⬇️ **Exports** | Real CSV, Excel, and PDF generation — not mocked |

---

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + hand-built shadcn/ui-style components |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team/) + `better-sqlite3` |
| Auth | JWT sessions (httpOnly cookies via `jose`) + route-protecting middleware |
| Charts | [Recharts](https://recharts.org/) |
| Map | [React-Leaflet](https://react-leaflet.js.org/) + OpenStreetMap |
| Exports | `papaparse` (CSV) · `exceljs` (Excel) · `pdfkit` (PDF) |

---

## 🚀 Getting started

**Requirements:** Node.js ≥ 18.18

```bash
git clone https://github.com/ziadrenal1ne/F-OCP-beneficiary-management-platform.git
cd F-OCP-beneficiary-management-platform
=======
# Fondation OCP — Plateforme Axe Éco-Social

Plateforme interne de gestion des coopératives et des bénéficiaires de l’Axe Éco-Social. Ce MVP couvre le cycle complet : identités, tableaux de bord, profils, statistiques mensuelles, rapports à valider, documents, import CSV, carte, ODD, analytique et exports.

## Identifiants

| Rôle | E-mail | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin@focp.local` | `admin123` |
| Représentant coopérative | `cooperative@focp.local` | `cooperative123` |

Le représentant est rattaché à la **Coopérative Agricole Al Amal de Khouribga**.

## Installation

```bash
>>>>>>> 2fdf0481223fe1cda076f730b7840cfac8ea38fc
npm install
npm run dev
```

<<<<<<< HEAD
That's it — on first run, the app automatically initializes the SQLite database and seeds it with 50 demo cooperatives, users, and 12 months of history. No manual DB setup required.

Open **http://localhost:3000** and log in with one of the demo accounts below.

<details>
<summary><strong>Production build</strong></summary>

```bash
npm run build
npm run start
```
</details>

<details>
<summary><strong>Useful scripts</strong></summary>

| Command | Description |
|---|---|
| `npm run db:reset` | Wipe and re-seed the demo database |
| `npm run db:studio` | Open Drizzle Studio to browse the database |
| `npm run db:seed` | Re-run the seed script only |
</details>

---

## 🔑 Demo credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Administrator | `admin@focp.local` | `admin123` | Full — all cooperatives |
| Cooperative rep | `cooperative@focp.local` | `cooperative123` | Scoped to one cooperative |

---

## 📂 Project structure

```
src/
├── app/
│   ├── admin/            # Admin space — dashboard, cooperatives, map, reports,
│   │                       documents, conventions, import, search, analytics,
│   │                       exports, notifications, settings
│   ├── cooperative/       # Cooperative space — dashboard, profile, beneficiaries,
│   │                       reports, documents, notifications, settings
│   ├── actions/          # Server Actions (auth, cooperative ops, CSV import)
│   ├── api/export/       # CSV / Excel / PDF generation routes
│   └── login/
├── components/
│   ├── ui/                # Base UI primitives
│   ├── shell/              # Sidebar, topbar, KPI cards
│   ├── charts/              # Reusable Recharts wrappers
│   └── map/                 # Client-only Leaflet map components
├── db/
│   ├── schema.ts          # Full relational schema (Drizzle)
│   ├── seed.ts              # Demo data generator
│   └── seed-data.ts          # Reference data (cities, sectors, ODDs)
└── lib/
    ├── auth.ts            # Session handling
    └── data.ts              # Shared data-access layer
scripts/
└── setup-db.ts           # First-run database initialization
```

---

## 🖼️ Screenshots

<!--
  Add real screenshots here once available. Suggested shots:
  - Login screen
  - Admin dashboard
  - Interactive map
  - Cooperative detail page
  - Report validation flow
  - Analytics page
-->

| Login | Dashboard |
|---|---|
| ![Login](docs/screenshot-login.png) | ![Dashboard](docs/screenshot-dashboard.png) |

| Map | Analytics |
|---|---|
| ![Map](docs/screenshot-map.png) | ![Analytics](docs/screenshot-analytics.png) |

---

## 🗺️ Roadmap

- [ ] Real file storage (S3 / Azure Blob) with in-app previews
- [ ] Pagination & virtualization for 1,700+ cooperative lists
- [ ] Real-time notifications (WebSocket/SSE)
- [ ] Granular roles (regional supervisor, read-only)
- [ ] Document version history with diffing
- [ ] Public API (OpenAPI-documented)
- [ ] SSO authentication
- [ ] PostgreSQL migration path for production scale
- [ ] Automated tests (Vitest + Playwright)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
<sub>Built by <a href="https://github.com/ziadrenal1ne">Ziad Cherkaoui</a></sub>
</div>
=======
L’application démarre sur le port 8080. La base embarquée (PGLite) est initialisée automatiquement : schéma, 50 coopératives marocaines, rapports, conventions, ODD, indicateurs ESG et comptes de démonstration.

Aucune variable d’environnement n’est requise en local. En déploiement, `DATABASE_URL` active Postgres (Neon).

## Structure

```
src/
  components/     UI, layout, carte, graphiques
  hooks/
  lib/            auth, db, types, seed, API serveur
  routes/         pages TanStack Router
  styles.css      tokens (clair / sombre)
migrations/       SQL (auth + métier)
prisma/           schéma documentaire (non exécuté)
```

## Modules livrés

1. Authentification e-mail / mot de passe (rôles admin et coopérative)
2. Tableau de bord administrateur (KPI, ODD, activité, validations)
3. Tableau de bord coopérative (périmètre restreint)
4. Fiche coopérative éditable
5. Statistiques de bénéficiaires mensuelles
6. Rapports mensuels + workflow Approuver / Rejeter
7. Documents (téléversement, version, aperçu, validation)
8. Import CSV administrateur avec rapport d’erreurs
9. Carte interactive (marqueurs, filtres, fiche)
10. Liaison multi-ODD
11. Notifications
12. Recherche avancée
13. Analytique (barres, camemberts, tendances)
14. Exports CSV / Excel / PDF
15. Journal d’audit, thème clair/sombre, paramètres

## Sécurité MVP

- Routes protégées (session Better Auth)
- Filtrage par rôle côté serveur
- Validation Zod des formulaires
- Contrôle des types et de la taille des fichiers
- Mots de passe hachés
- Journal d’audit

## Captures d'écran

Les captures de démonstration se trouvent dans `screenshots/` (connexion, tableaux de bord admin et coopérative, carte, rapports, documents, ODD, analytique, import, etc.).

## Feuille de route — Version 2

- Multi-utilisateurs par coopérative et délégation de rôles
- Connexion aux 1 700 coopératives réelles et au SI Fondation
- Workflows de convention (signature, avenants, alertes J-90)
- Collecte mobile hors-ligne pour les animateurs de terrain
- Entrepôt de fichiers (S3) et antivirus
- Tableaux de bord ESG alignés GRI / ISSB
- API publique et SSO d’entreprise
- Modèle de données géospatial (limites communales)

## Schéma

Le schéma SQL source de vérité est `migrations/0002_schema.sql`. Un miroir Prisma documentaire se trouve dans `prisma/schema.prisma`.
>>>>>>> 2fdf0481223fe1cda076f730b7840cfac8ea38fc
