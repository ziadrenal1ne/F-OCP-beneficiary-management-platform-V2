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
npm install
npm run dev
```

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
