# Plateforme de Gestion des Bénéficiaires — Axe Éco-Social, Fondation OCP

MVP fonctionnel de la plateforme décrite dans le Cahier des Charges : centralisation des données de ~1 700 coopératives marocaines (bénéficiaires, ODD, ESG, rapports, conventions, documents) avec cartographie interactive, workflow de validation et exports.

Cette version de démonstration contient **50 coopératives réalistes**, réparties dans 30 villes marocaines, avec 12 mois d'historique de bénéficiaires, indicateurs ESG, rapports mensuels et documents.

---

## 1. Installation

Prérequis : Node.js ≥ 18.18.

```bash
npm install
npm run dev
```

C'est tout. Au premier lancement, `npm run dev` initialise automatiquement la base de données SQLite locale (`focp.db`) et génère les données de démonstration (50 coopératives, 2 utilisateurs, historique complet). Les lancements suivants réutilisent la base existante.

L'application est disponible sur **http://localhost:3000**.

Pour un build de production :
```bash
npm run build
npm run start
```

### Dépannage : échec d'installation de `better-sqlite3`

Sur certains réseaux d'entreprise restreints, le téléchargement du binaire précompilé de `better-sqlite3` peut occasionnellement échouer, ce qui déclenche une compilation depuis les sources (`node-gyp`) nécessitant un accès à `nodejs.org`. Si `npm install` échoue avec une erreur mentionnant `node-gyp rebuild` ou `nodejs.org`, relancez simplement :
```bash
npm install
```
Sur un réseau standard sans restriction, ce problème ne se produit pas — `better-sqlite3` embarque directement un binaire précompilé pour Linux/macOS/Windows et n'a normalement besoin d'aucune compilation.

### Réinitialiser les données de démonstration
```bash
npm run db:reset
```

### Explorer la base de données (interface visuelle Drizzle Studio)
```bash
npm run db:studio
```

---

## 2. Identifiants de connexion

| Rôle | Email | Mot de passe | Accès |
|---|---|---|---|
| Administrateur | `admin@focp.local` | `admin123` | Complet — toutes les coopératives |
| Représentant coopérative | `cooperative@focp.local` | `cooperative123` | Restreint — sa coopérative uniquement |

---

## 3. Stack technique

| Domaine | Choix | Remarque |
|---|---|---|
| Framework | Next.js 15 (App Router, Server Actions) | |
| Langage | TypeScript | |
| Style | Tailwind CSS v4 + composants shadcn/ui écrits à la main | Palette OCP (vert phosphate profond + or minéral) |
| Base de données | SQLite via **Drizzle ORM** + `better-sqlite3` | Prisma a été remplacé par Drizzle : le téléchargement des moteurs binaires de Prisma nécessite un accès réseau à `binaries.prisma.sh`, indisponible dans l'environnement de build utilisé pour cette démo. Drizzle + better-sqlite3 offrent une modélisation relationnelle et une sécurité de type équivalentes, sans dépendance réseau. Si votre environnement local a un accès réseau complet, une migration vers Prisma reste possible et directe (le schéma Drizzle est un miroir 1:1 du modèle relationnel prévu). |
| Authentification | Sessions JWT en cookie httpOnly (bibliothèque `jose`) + middleware de protection de routes | |
| Graphiques | Recharts | |
| Carte interactive | React-Leaflet + OpenStreetMap | |
| Export | `papaparse` (CSV), `exceljs` (Excel), `pdfkit` (PDF) | Génération réelle, pas de simulation |

---

## 4. Structure du projet

```
src/
  app/
    admin/                 # Espace administrateur (12 modules)
      page.tsx              # Tableau de bord
      cooperatives/          # Liste + fiche détaillée par coopérative
      map/                   # Carte interactive Leaflet
      reports/                # Validation des rapports mensuels
      documents/               # Revue documentaire
      conventions/              # Suivi des conventions
      import/                    # Import CSV
      search/                     # Recherche avancée multi-critères
      analytics/                   # Graphiques transversaux
      exports/                      # CSV / Excel / PDF
      notifications/
      settings/
    cooperative/            # Espace représentant coopérative
      page.tsx               # Tableau de bord
      profile/                 # Fiche coopérative éditable
      beneficiaries/             # Statistiques mensuelles éditables
      reports/                     # Soumission de rapports
      documents/                     # Téléversement de documents
      notifications/
      settings/
    actions/                # Server Actions (auth, coop, import)
    api/export/             # Routes API de génération de fichiers
    login/
  components/
    ui/                     # Primitives (bouton, carte, dialog, select…)
    shell/                  # Sidebar, topbar, cartes KPI
    charts/                 # Graphiques Recharts réutilisables
    map/                    # Composants carte (chargement dynamique client-only)
  db/
    schema.ts               # Schéma relationnel complet (Drizzle)
    seed.ts                  # Génération des données de démonstration
    seed-data.ts               # Référentiels (villes, secteurs, ODD)
  lib/
    auth.ts                 # Sessions, vérification des identifiants
    data.ts                  # Couche d'accès aux données (requêtes partagées)
scripts/
  setup-db.ts              # Initialisation automatique au premier lancement
```

---

## 5. Modules livrés

Tous les modules du cahier des charges sont fonctionnels avec des données réelles (pas de pages-écran statiques) :

1. **Authentification** — connexion par rôle, redirection automatique, sessions persistantes
2. **Tableau de bord administrateur** — KPI, évolution mensuelle, répartition ODD, activité récente, validations en attente
3. **Tableau de bord coopérative** — statistiques propres, bénéficiaires, rapports, conventions
4. **Profil coopérative** — informations générales éditables (côté coopérative)
5. **Bénéficiaires** — saisie et mise à jour mensuelle, historique visualisé
6. **Rapports mensuels** — soumission par la coopérative, validation par l'administrateur (approuver/rejeter avec commentaire)
7. **Documents** — téléversement, catégorisation, statut, versioning, revue administrateur
8. **Import CSV** — parsing réel (`papaparse`), validation ligne par ligne, rapport d'erreurs détaillé
9. **Carte interactive** — marqueurs Leaflet cliquables/survolables, popups avec infos coopérative, filtres région/ODD/statut
10. **ODD** — association multiple par coopérative, distribution visualisée
11. **Workflow de validation** — soumission → notification admin → décision → notification coopérative
12. **Recherche avancée** — filtres combinés (nom, région, province, secteur, statut, ODD)
13. **Notifications** — génération et affichage par type d'évènement
14. **Analytique** — graphiques en barres, aires, camemberts, tendances ESG, croissance
15. **Exports** — CSV, Excel (`exceljs`, mise en forme), PDF (`pdfkit`, rapport de synthèse) — génération réelle testée, vérifiée en conditions de production

---

## 6. Sécurité

- Routes `/admin/*` et `/cooperative/*` protégées par middleware (redirection si session absente ou rôle incorrect)
- Mots de passe hashés avec `bcryptjs`
- Sessions signées (JWT, cookie httpOnly, `sameSite=lax`)
- Validation des entrées sur les Server Actions (import CSV, formulaires)
- Journal d'audit (`audit_logs`) sur les actions sensibles (connexion, import, validation, soumission)

---

## 7. Limites connues de ce MVP

- Le mot de passe administrateur n'est pas modifiable dans l'interface (démonstration)
- Les fichiers téléversés ne sont pas physiquement stockés sur disque (seuls les métadonnées sont enregistrées) — à connecter à un stockage objet (S3, Azure Blob) en production
- Pas de pagination sur les listes longues (acceptable à l'échelle de 50 coopératives, à ajouter avant la montée à 1 700)

---

## 8. Roadmap V2 (suggestions)

- **Stockage de fichiers réel** (S3/Azure Blob) avec prévisualisation PDF/image intégrée
- **Pagination et virtualisation** des listes pour supporter 1 700+ coopératives
- **Notifications en temps réel** (WebSocket/SSE) plutôt que polling à l'affichage
- **Rôles supplémentaires** (superviseur régional, lecture seule) avec permissions granulaires
- **Historique des versions de documents** avec diff visuel
- **API publique documentée** (OpenAPI) pour intégrations tierces (SIG, ERP interne OCP)
- **Authentification SSO** (Azure AD / OCP identity provider)
- **Application mobile** pour la saisie terrain par les représentants de coopératives
- **Migration vers PostgreSQL** pour la montée en charge en production (le schéma Drizzle est portable)
- **Tests automatisés** (Vitest + Playwright) sur les parcours critiques
#   F - O C P - b e n e f i c i a r y - m a n a g e m e n t - p l a t f o r m  
 