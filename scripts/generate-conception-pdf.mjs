import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const outputPathHtml = path.resolve("./focp_conception_doc.html");
const outputPathPdf = path.resolve("./F-OCP_Dossier_de_Conception.pdf");

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>F-OCP — Dossier de Conception Technique et Fonctionnelle</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 9.5pt;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    .avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 98vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 20px 20px 20px;
      position: relative;
    }

    .cover-top {
      border-top: 6px solid #1b4332;
      padding-top: 25px;
    }

    .badge-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: #e8f5e9;
      color: #1b4332;
      border: 1px solid #c8e6c9;
      margin-bottom: 18px;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      color: #0f291e;
      line-height: 1.15;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 500;
      color: #2d6a4f;
      margin-bottom: 25px;
      max-width: 90%;
      line-height: 1.4;
    }

    .cover-divider {
      height: 3px;
      background: linear-gradient(90deg, #1b4332, #52b788, #d8f3dc);
      border-radius: 2px;
      margin-bottom: 30px;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 25px;
    }

    .cover-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      border-left: 4px solid #2d6a4f;
    }

    .cover-card-num {
      font-size: 16pt;
      font-weight: 800;
      color: #1b4332;
      line-height: 1;
      margin-bottom: 4px;
    }

    .cover-card-label {
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .cover-card-desc {
      font-size: 8pt;
      color: #334155;
      margin-top: 4px;
    }

    .cover-abstract {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }

    .cover-abstract h4 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #166534;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cover-abstract p {
      font-size: 8.5pt;
      color: #1e3a2b;
      line-height: 1.45;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .meta-col {
      font-size: 8pt;
      color: #64748b;
    }

    .meta-col strong {
      color: #0f172a;
      display: block;
      font-size: 8.5pt;
    }

    /* Headings & Content Structure */
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 14px;
    }

    .header-doc-title {
      font-size: 7.5pt;
      font-weight: 700;
      color: #2d6a4f;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-doc-page {
      font-size: 7.5pt;
      color: #94a3b8;
    }

    h1 {
      font-size: 16pt;
      font-weight: 800;
      color: #0f291e;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h1 .section-num {
      background: #1b4332;
      color: #ffffff;
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      font-size: 10pt;
      font-weight: 800;
    }

    h2 {
      font-size: 12pt;
      font-weight: 700;
      color: #1b4332;
      margin-top: 12px;
      margin-bottom: 6px;
      border-left: 3px solid #40916c;
      padding-left: 8px;
    }

    h3 {
      font-size: 10pt;
      font-weight: 700;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
      text-align: justify;
    }

    /* Callout Boxes */
    .callout {
      border-radius: 6px;
      padding: 9px 12px;
      margin: 10px 0;
      font-size: 8.5pt;
      display: flex;
      gap: 10px;
      border-left: 3.5px solid transparent;
    }

    .callout-info {
      background: #eff6ff;
      border-left-color: #3b82f6;
      border: 1px solid #dbeafe;
      border-left-width: 4px;
      color: #1e40af;
    }

    .callout-success {
      background: #f0fdf4;
      border-left-color: #22c55e;
      border: 1px solid #dcfce7;
      border-left-width: 4px;
      color: #166534;
    }

    .callout-warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
      border: 1px solid #fef3c7;
      border-left-width: 4px;
      color: #92400e;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 8pt;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .badge {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 7pt;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }

    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-amber { background: #fef3c7; color: #b45309; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }
    .badge-gray { background: #f1f5f9; color: #475569; }

    /* Code / Monospace */
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 3px;
      color: #0f172a;
    }

    /* Diagram Containers */
    .diagram-container {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      margin: 10px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      page-break-inside: avoid;
    }

    .diagram-title {
      font-size: 8.5pt;
      font-weight: 700;
      color: #1b4332;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
    }

    .diagram-tag {
      font-size: 7pt;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .card-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
    }

    .card-box h4 {
      font-size: 8.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    ul, ol {
      margin-left: 16px;
      margin-bottom: 8px;
      font-size: 8.5pt;
      color: #334155;
    }

    li {
      margin-bottom: 2.5px;
    }

    .metric-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-right: 4px;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>

  <!-- ================= COVER PAGE ================= -->
  <div class="cover-page page-break">
    <div class="cover-top">
      <div class="badge-tag">🌿 Fondation OCP — Architecture & Spécifications</div>
      <div class="cover-title">F-OCP : Plateforme de Suivi des Bénéficiaires & Impact Coopératif</div>
      <div class="cover-subtitle">Dossier de Conception Technique et Fonctionnelle (Architecture Full-Stack, Modélisation Relationnelle, Workflows de Validation & Métriques ESG/ODD)</div>
      <div class="cover-divider"></div>

      <div class="cover-grid">
        <div class="cover-card">
          <div class="cover-card-num">1 700+</div>
          <div class="cover-card-label">Coopératives Cibles</div>
          <div class="cover-card-desc">Couverture nationale sur 12 régions et 30+ provinces marocaines.</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">17 ODD</div>
          <div class="cover-card-label">Indicateurs ONU</div>
          <div class="cover-card-desc">Alignement stratégique et scoring ESG (Environnement, Social, Gouvernance).</div>
        </div>
        <div class="cover-card">
          <div class="cover-card-num">Full-Stack</div>
          <div class="cover-card-label">Next.js 15 & Drizzle</div>
          <div class="cover-card-desc">Architecture découplée, Server Actions, JWT sécurisé et exports multiformats.</div>
        </div>
      </div>

      <div class="cover-abstract">
        <h4>📋 Résumé Exécutif</h4>
        <p>
          Ce dossier technique détaille la conception complète de la plateforme <strong>F-OCP</strong>, développée pour centraliser, auditer et valoriser l'impact socio-économique du réseau de coopératives soutenu par la <strong>Fondation OCP</strong>. Il synthétise l'architecture logicielle, les diagrammes de flux de validation, le modèle de données relationnel (11 entités), les mécanismes de sécurité multi-tenant, le moteur cartographique géospatial et les pipelines d'import/export de données haute performance.
        </p>
      </div>

      <div class="grid-2">
        <div class="card-box" style="border-left: 3px solid #1b4332;">
          <h4 style="color:#1b4332;">🎯 Objectifs Stratégiques</h4>
          <ul style="margin-left: 14px; margin-bottom: 0;">
            <li>Centralisation des profils et rapports d'activité des coopératives.</li>
            <li>Désagrégation mensuelle précise des bénéficiaires (Femmes, Jeunes, Handicapés, etc.).</li>
            <li>Workflow d'approbation et d'audit documentaire en circuit fermé.</li>
          </ul>
        </div>
        <div class="card-box" style="border-left: 3px solid #2d6a4f;">
          <h4 style="color:#2d6a4f;">⚡ Performance & Robustesse</h4>
          <ul style="margin-left: 14px; margin-bottom: 0;">
            <li>Zero-latency Server Components & Server Actions avec typage strict TypeScript.</li>
            <li>Ingestion CSV industrielle avec validation ligne par ligne et reporting d'erreurs.</li>
            <li>Génération de rapports exportables en CSV, Excel multi-onglets et PDF vectoriel.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="meta-col">
        <strong>Auteur & Ingénierie</strong>
        Ziad Cherkaoui (Lead Software Engineer)
      </div>
      <div class="meta-col">
        <strong>Organisation</strong>
        Fondation OCP / Maroc
      </div>
      <div class="meta-col">
        <strong>Version du Document</strong>
        v1.0 — Architecture de Référence
      </div>
      <div class="meta-col">
        <strong>Date d'Édition</strong>
        Septembre 2026
      </div>
    </div>
  </div>

  <!-- ================= SECTION 1 : CONTEXTE & VISION ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 1 · Vision & Contexte</span>
    </div>

    <h1><span class="section-num">1</span> Contexte, Problématique & Vision Métier</h1>

    <h2>1.1 Contexte Institutionnel & Enjeux</h2>
    <p>
      La <strong>Fondation OCP</strong> est un acteur majeur du développement humain et socio-économique au Maroc. Dans le cadre de ses programmes d'accompagnement des coopératives agricoles, artisanales et de transformation (plus de 1 700 structures réparties sur tout le territoire national), la collecte, la consolidation et l'évaluation de l'impact réel représentent un défi opérationnel stratégique.
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Matrice Problématique Métier vs Solutions Implémentées par F-OCP</span>
        <span class="diagram-tag">Analyse Fonctionnelle</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 24%;">Défi Historique</th>
            <th style="width: 38%;">Impact Opérationnel & Risques</th>
            <th style="width: 38%;">Solution Technique & Fonctionnelle F-OCP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dispersion des Données</strong></td>
            <td>Fichiers Excel multiples, perte d'historique, absence de référentiel unifié des 1 700+ coopératives.</td>
            <td><strong>Base relationnelle centralisée</strong> (Drizzle ORM) avec profil unifié, géolocalisation GPS et conventions.</td>
          </tr>
          <tr>
            <td><strong>Mesure d'Impact Floue</strong></td>
            <td>Comptabilisation globale sans désagrégation par genre, tranche d'âge ou situation de handicap.</td>
            <td><strong>Module Bénéficiaires multi-dimensionnel</strong> (Femmes, Hommes, Jeunes, Adultes, Enfants, Handicapés, Indirects).</td>
          </tr>
          <tr>
            <td><strong>Validation Non Tracée</strong></td>
            <td>Échanges d'emails informels pour valider les rapports mensuels et justificatifs de dépenses.</td>
            <td><strong>Workflow d'audit à états finis</strong> (Brouillon → Soumis → Approuvé/Rejeté avec motif consigné).</td>
          </tr>
          <tr>
            <td><strong>Absence de Suivi ODD/ESG</strong></td>
            <td>Difficulté d'aligner les résultats terrain avec les 17 Objectifs de Développement Durable de l'ONU.</td>
            <td><strong>Moteur de scoring ODD & ESG</strong> tri-factoriel (Environnement, Social, Gouvernance) en temps réel.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>1.2 Personas Utilisateurs & Périmètres de Droits (RBAC)</h2>
    <p>
      L'application est cloisonnée en deux espaces distincts et strictement étanches grâce au contrôle d'accès basé sur les rôles (RBAC) :
    </p>

    <div class="grid-2" style="margin-top: 6px;">
      <div class="card-box" style="border-top: 3px solid #1b4332;">
        <h3 style="color: #1b4332; margin-top: 0;">👑 Administrateur Fondation OCP</h3>
        <p style="font-size: 8pt; margin-bottom: 4px;"><strong>Périmètre :</strong> Vision globale et transverse sur l'ensemble du réseau national.</p>
        <ul style="font-size: 7.8pt;">
          <li>Pilotage des KPIs macroéconomiques et agrégats régionaux.</li>
          <li>Revue et validation/rejet des rapports d'activité et documents.</li>
          <li>Gestion des conventions financières et alertes d'expiration.</li>
          <li>Importation massive CSV avec audit des erreurs.</li>
          <li>Exportation certifiée (PDF, Excel multi-feuilles, CSV brut).</li>
          <li>Recherche avancée multicritères et cartographie interactive.</li>
        </ul>
      </div>

      <div class="card-box" style="border-top: 3px solid #2d6a4f;">
        <h3 style="color: #2d6a4f; margin-top: 0;">🏢 Représentant de Coopérative</h3>
        <p style="font-size: 8pt; margin-bottom: 4px;"><strong>Périmètre :</strong> Cloisonné exclusivement à sa propre structure (Scoped Multi-Tenant).</p>
        <ul style="font-size: 7.8pt;">
          <li>Édition de la fiche signalétique et gouvernance.</li>
          <li>Saisie mensuelle des bénéficiaires et archivage historique.</li>
          <li>Rédaction et soumission des rapports d'activités mensuels.</li>
          <li>Téléversement et catégorisation des pièces justificatives.</li>
          <li>Réception des notifications et motifs de rejet en temps réel.</li>
          <li>Suivi de ses propres indicateurs ESG et ODD associés.</li>
        </ul>
      </div>
    </div>

    <h2>1.3 Cartographie Fonctionnelle des Modules</h2>
    <div class="diagram-container">
      <div class="diagram-title">
        <span>Diagramme Structurel des Modules de la Plateforme F-OCP</span>
        <span class="diagram-tag">Vue d'Ensemble</span>
      </div>
      <svg viewBox="0 0 780 180" style="width: 100%; height: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
        <!-- Background -->
        <rect x="0" y="0" width="780" height="180" fill="#f8fafc" rx="8" />
        
        <!-- Core Platform -->
        <rect x="290" y="10" width="200" height="35" rx="6" fill="#1b4332" />
        <text x="390" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Plateforme Core F-OCP</text>

        <!-- Admin Side -->
        <rect x="20" y="60" width="360" height="105" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="20" y="60" width="360" height="24" rx="6" fill="#2d6a4f" />
        <text x="200" y="76" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">Espace Administrateur (Supervision Réseau)</text>
        
        <rect x="30" y="92" width="100" height="30" rx="4" fill="#e8f5e9" stroke="#a5d6a7" />
        <text x="80" y="106" fill="#1b4332" font-size="7.5" font-weight="bold" text-anchor="middle">KPIs & Analytics</text>
        <text x="80" y="116" fill="#2e7d32" font-size="6.5" text-anchor="middle">Recharts & ODD</text>

        <rect x="150" y="92" width="100" height="30" rx="4" fill="#e8f5e9" stroke="#a5d6a7" />
        <text x="200" y="106" fill="#1b4332" font-size="7.5" font-weight="bold" text-anchor="middle">Workflow Validation</text>
        <text x="200" y="116" fill="#2e7d32" font-size="6.5" text-anchor="middle">Rapports & Docs</text>

        <rect x="270" y="92" width="100" height="30" rx="4" fill="#e8f5e9" stroke="#a5d6a7" />
        <text x="320" y="106" fill="#1b4332" font-size="7.5" font-weight="bold" text-anchor="middle">Cartographie SIG</text>
        <text x="320" y="116" fill="#2e7d32" font-size="6.5" text-anchor="middle">Leaflet 12 Régions</text>

        <rect x="30" y="128" width="100" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="80" y="145" fill="#334155" font-size="7.5" font-weight="bold" text-anchor="middle">Import CSV ETL</text>

        <rect x="150" y="128" width="100" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="200" y="145" fill="#334155" font-size="7.5" font-weight="bold" text-anchor="middle">Exports Multi-Format</text>

        <rect x="270" y="128" width="100" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="320" y="145" fill="#334155" font-size="7.5" font-weight="bold" text-anchor="middle">Audit Logs & Traces</text>

        <!-- Coop Side -->
        <rect x="400" y="60" width="360" height="105" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <rect x="400" y="60" width="360" height="24" rx="6" fill="#40916c" />
        <text x="580" y="76" fill="#ffffff" font-size="9.5" font-weight="bold" text-anchor="middle">Espace Coopérative (Gestion Locale)</text>

        <rect x="410" y="92" width="105" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
        <text x="462" y="106" fill="#1e40af" font-size="7.5" font-weight="bold" text-anchor="middle">Profil & Gouvernance</text>
        <text x="462" y="116" fill="#3b82f6" font-size="6.5" text-anchor="middle">Fiche & Contacts</text>

        <rect x="530" y="92" width="105" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
        <text x="582" y="106" fill="#1e40af" font-size="7.5" font-weight="bold" text-anchor="middle">Saisie Bénéficiaires</text>
        <text x="582" y="116" fill="#3b82f6" font-size="6.5" text-anchor="middle">Désagrégation Genre/Âge</text>

        <rect x="645" y="92" width="105" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
        <text x="697" y="106" fill="#1e40af" font-size="7.5" font-weight="bold" text-anchor="middle">Rapports d'Activité</text>
        <text x="697" y="116" fill="#3b82f6" font-size="6.5" text-anchor="middle">Rédaction & Soumission</text>

        <rect x="410" y="128" width="165" height="28" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="492" y="145" fill="#334155" font-size="7.5" font-weight="bold" text-anchor="middle">Coffre Documentaire Numérique</text>

        <rect x="585" y="128" width="165" height="28" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="667" y="145" fill="#334155" font-size="7.5" font-weight="bold" text-anchor="middle">Notifications & Retours Audit</text>

        <!-- Connecting Lines -->
        <path d="M 340 45 L 200 60" stroke="#1b4332" stroke-width="1.5" fill="none" />
        <path d="M 440 45 L 580 60" stroke="#1b4332" stroke-width="1.5" fill="none" />
      </svg>
    </div>
  </div>

  <!-- ================= SECTION 2 : ARCHITECTURE TECHNIQUE ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 2 · Architecture Technique Globale</span>
    </div>

    <h1><span class="section-num">2</span> Architecture Système & Choix Technologiques</h1>

    <h2>2.1 Architecture Logique en Couches (Layered Architecture)</h2>
    <p>
      L'application repose sur le framework moderne <strong>Next.js 15 (App Router)</strong> avec <strong>React 19 Server Components</strong> et <strong>Server Actions</strong>, assurant une stricte séparation des responsabilités entre présentation, logique d'affaires, sécurité et persistance relationnelle.
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Diagramme d'Architecture Technique Full-Stack</span>
        <span class="diagram-tag">Stack & Découplage</span>
      </div>
      <svg viewBox="0 0 780 280" style="width: 100%; height: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
        <!-- Background -->
        <rect x="0" y="0" width="780" height="280" fill="#f8fafc" rx="8" />

        <!-- Layer 1: Presentation & Clients -->
        <rect x="15" y="10" width="750" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="25" y="18" width="130" height="32" rx="4" fill="#1b4332" />
        <text x="90" y="38" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Clients / Navigateurs</text>

        <rect x="170" y="20" width="180" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="260" y="38" fill="#0f172a" font-size="7.5" font-weight="600" text-anchor="middle">Tailwind CSS v4 + Radix UI</text>

        <rect x="360" y="20" width="190" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="455" y="38" fill="#0f172a" font-size="7.5" font-weight="600" text-anchor="middle">Visualisation : Recharts + Leaflet</text>

        <rect x="560" y="20" width="195" height="28" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text x="657" y="38" fill="#0f172a" font-size="7.5" font-weight="600" text-anchor="middle">React Hook Form + Zod V4</text>

        <!-- Arrow 1-2 -->
        <line x1="390" y1="58" x2="390" y2="72" stroke="#2d6a4f" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Layer 2: Next.js App Router & Security -->
        <rect x="15" y="72" width="750" height="60" rx="6" fill="#f0fdf4" stroke="#86efac" stroke-width="1.2" />
        <rect x="25" y="80" width="130" height="44" rx="4" fill="#2d6a4f" />
        <text x="90" y="98" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Next.js 15 App Router</text>
        <text x="90" y="112" fill="#d8f3dc" font-size="7" text-anchor="middle">Edge Middleware & Auth</text>

        <rect x="170" y="82" width="180" height="40" rx="4" fill="#ffffff" stroke="#bbf7d0" />
        <text x="260" y="98" fill="#166534" font-size="7.5" font-weight="bold" text-anchor="middle">RSC (Server Components)</text>
        <text x="260" y="112" fill="#64748b" font-size="6.5" text-anchor="middle">Zero-bundle data rendering</text>

        <rect x="360" y="82" width="190" height="40" rx="4" fill="#ffffff" stroke="#bbf7d0" />
        <text x="455" y="98" fill="#166534" font-size="7.5" font-weight="bold" text-anchor="middle">Server Actions (Mutations)</text>
        <text x="455" y="112" fill="#64748b" font-size="6.5" text-anchor="middle">Type-safe RPC & Form Handlers</text>

        <rect x="560" y="82" width="195" height="40" rx="4" fill="#ffffff" stroke="#bbf7d0" />
        <text x="657" y="98" fill="#166534" font-size="7.5" font-weight="bold" text-anchor="middle">API Route Handlers</text>
        <text x="657" y="112" fill="#64748b" font-size="6.5" text-anchor="middle">Streaming Exports (PDF/Excel/CSV)</text>

        <!-- Arrow 2-3 -->
        <line x1="390" y1="132" x2="390" y2="146" stroke="#2d6a4f" stroke-width="2" />

        <!-- Layer 3: Data Access & Business Logic -->
        <rect x="15" y="146" width="750" height="60" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="25" y="154" width="130" height="44" rx="4" fill="#40916c" />
        <text x="90" y="172" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Data Access Layer</text>
        <text x="90" y="186" fill="#d8f3dc" font-size="7" text-anchor="middle">lib/data.ts & auth.ts</text>

        <rect x="170" y="156" width="180" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="260" y="172" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">Drizzle ORM v0.45</text>
        <text x="260" y="186" fill="#64748b" font-size="6.5" text-anchor="middle">Type-safe SQL queries & relations</text>

        <rect x="360" y="156" width="190" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="455" y="172" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">JWT Session Token Engine</text>
        <text x="455" y="186" fill="#64748b" font-size="6.5" text-anchor="middle">jose · httpOnly Secure Cookies</text>

        <rect x="560" y="156" width="195" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="657" y="172" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">Moteurs de Génération</text>
        <text x="657" y="186" fill="#64748b" font-size="6.5" text-anchor="middle">ExcelJS · PDFKit · PapaParse</text>

        <!-- Arrow 3-4 -->
        <line x1="390" y1="206" x2="390" y2="220" stroke="#2d6a4f" stroke-width="2" />

        <!-- Layer 4: Storage & Persistence -->
        <rect x="15" y="220" width="750" height="50" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2" />
        <rect x="25" y="228" width="130" height="34" rx="4" fill="#0f291e" />
        <text x="90" y="249" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Persistance & Stockage</text>

        <rect x="170" y="228" width="280" height="34" rx="4" fill="#e2e8f0" />
        <text x="310" y="245" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">SQLite (better-sqlite3) / Target PostgreSQL</text>
        <text x="310" y="255" fill="#475569" font-size="6.5" text-anchor="middle">Schéma relationnel ACID avec index uniques et cascades</text>

        <rect x="460" y="228" width="295" height="34" rx="4" fill="#e2e8f0" />
        <text x="607" y="245" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">Stockage Fichiers & Documents Justificatifs</text>
        <text x="607" y="255" fill="#475569" font-size="6.5" text-anchor="middle">Local Storage (MVP) / S3-compatible Cloud Storage (Prod)</text>
      </svg>
    </div>

    <h2>2.2 Matrice Technique Détaillée des Composants</h2>
    <table>
      <thead>
        <tr>
          <th>Composant</th>
          <th>Technologie / Librairie</th>
          <th>Version</th>
          <th>Rôle Fonctionnel & Justification Technique</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Framework Web</strong></td>
          <td>Next.js (App Router)</td>
          <td><code>15.5.22</code></td>
          <td>Rendu hybride SSR/RSC, Server Actions intégrées, optimisation des assets et performances SEO/WebVitals.</td>
        </tr>
        <tr>
          <td><strong>Langage</strong></td>
          <td>TypeScript</td>
          <td><code>5.x</code></td>
          <td>Typage statique strict de bout en bout (Schéma DB → DTO Actions → Props Composants UI).</td>
        </tr>
        <tr>
          <td><strong>Style & UI System</strong></td>
          <td>Tailwind CSS v4 + Radix UI</td>
          <td><code>4.0 / 2.x</code></td>
          <td>Design system modulaire inspiré de shadcn/ui, responsive design et accessibilité ARIA conforme.</td>
        </tr>
        <tr>
          <td><strong>ORM & Requêtage</strong></td>
          <td>Drizzle ORM</td>
          <td><code>0.45.2</code></td>
          <td>ORM léger à empreinte mémoire nulle, requêtage SQL pur type-safe, migrations automatisées via Drizzle Kit.</td>
        </tr>
        <tr>
          <td><strong>Moteur Base de Données</strong></td>
          <td>SQLite via better-sqlite3</td>
          <td><code>13.0.3</code></td>
          <td>Persistance autonome zéro-configuration pour MVP & transition directe vers PostgreSQL supportée.</td>
        </tr>
        <tr>
          <td><strong>Authentification / Session</strong></td>
          <td>jose & bcryptjs</td>
          <td><code>6.2 / 3.0</code></td>
          <td>Tokens JWT signés HMAC-SHA256 stockés en cookies <code>httpOnly</code>, <code>sameSite=lax</code>, hachage salé des mots de passe.</td>
        </tr>
        <tr>
          <td><strong>Moteur Graphique / BI</strong></td>
          <td>Recharts</td>
          <td><code>3.10.1</code></td>
          <td>Courbes d'évolution mensuelle, camemberts de répartition ODD et histogrammes démographiques interactifs.</td>
        </tr>
        <tr>
          <td><strong>SIG & Cartographie</strong></td>
          <td>React-Leaflet + OpenStreetMap</td>
          <td><code>5.0 / 1.9</code></td>
          <td>Projection cartographique des 1 700+ coopératives, filtrage dynamique par région/province et popups interactifs.</td>
        </tr>
        <tr>
          <td><strong>Génération d'Exports</strong></td>
          <td>ExcelJS, PDFKit, PapaParse</td>
          <td><code>4.4 / 0.19 / 5.5</code></td>
          <td>Génération réelle côté serveur de fichiers tableurs multi-onglets stylisés et rapports PDF institutionnels.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= SECTION 3 : MODÈLE DE DONNÉES ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 3 · Modélisation Relationnelle</span>
    </div>

    <h1><span class="section-num">3</span> Modèle de Données & Schéma Relationnel</h1>

    <h2>3.1 Diagramme Entité-Association (Entity-Relationship Diagram - ERD)</h2>
    <p>
      La structure de la base de données est normalisée en 3ème Forme Normale (3NF) et comprend <strong>11 tables</strong> interconnectées garantissant l'intégrité référentielle, le cascade delete et des index uniques composites sur les périodes temporelles (<code>month + year + cooperative_id</code>).
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Modèle Conceptuel & Logique des Données (11 Entités Drizzle Schema)</span>
        <span class="diagram-tag">ERD Relationnel</span>
      </div>
      <svg viewBox="0 0 780 340" style="width: 100%; height: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
        <rect x="0" y="0" width="780" height="340" fill="#f8fafc" rx="8" />

        <!-- Entity: cooperatives (CENTER) -->
        <rect x="290" y="100" width="200" height="150" rx="6" fill="#ffffff" stroke="#1b4332" stroke-width="2" />
        <rect x="290" y="100" width="200" height="24" rx="6" fill="#1b4332" />
        <text x="390" y="116" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">cooperatives (Core)</text>
        <text x="300" y="138" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id: text [PK]</text>
        <text x="300" y="152" fill="#334155" font-size="7.5">name, description, sector</text>
        <text x="300" y="166" fill="#334155" font-size="7.5">city, province, region, country</text>
        <text x="300" y="180" fill="#334155" font-size="7.5">latitude, longitude [Real]</text>
        <text x="300" y="194" fill="#334155" font-size="7.5">phone, email, website, legal_status</text>
        <text x="300" y="208" fill="#334155" font-size="7.5">status: ACTIVE | PENDING | SUSPENDED</text>
        <text x="300" y="222" fill="#334155" font-size="7.5">creation_date, created_at, updated_at</text>

        <!-- Entity: users (TOP CENTER) -->
        <rect x="290" y="10" width="200" height="70" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="290" y="10" width="200" height="20" rx="6" fill="#2d6a4f" />
        <text x="390" y="24" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">users (Authentification)</text>
        <text x="300" y="44" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id: text [PK], email (UQ)</text>
        <text x="300" y="58" fill="#334155" font-size="7.5">name, password_hash, role: ADMIN | COOP</text>
        <text x="300" y="72" fill="#64748b" font-size="7.5">🔗 cooperative_id [FK 0..1]</text>

        <!-- Line Users - Coops -->
        <line x1="390" y1="80" x2="390" y2="100" stroke="#1b4332" stroke-width="1.5" stroke-dasharray="3,3" />

        <!-- Entity: beneficiary_records (LEFT TOP) -->
        <rect x="15" y="15" width="230" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="15" y="15" width="230" height="20" rx="6" fill="#40916c" />
        <text x="130" y="29" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">beneficiary_records (Suivi Mensuel)</text>
        <text x="25" y="48" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK] · 🔗 coop_id [FK]</text>
        <text x="25" y="62" fill="#334155" font-size="7.5">month, year [UQ composite]</text>
        <text x="25" y="76" fill="#334155" font-size="7.5">women, men, youth, adults, children</text>
        <text x="25" y="90" fill="#334155" font-size="7.5">disabled, indirect (estimations)</text>

        <!-- Line Coop -> Beneficiaries -->
        <path d="M 290 130 L 245 80" stroke="#2d6a4f" stroke-width="1.5" />
        <text x="250" y="110" font-size="7" fill="#64748b">1..*</text>

        <!-- Entity: reports (LEFT BOTTOM) -->
        <rect x="15" y="120" width="230" height="95" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="15" y="120" width="230" height="20" rx="6" fill="#40916c" />
        <text x="130" y="134" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">reports (Rapports d'Activité)</text>
        <text x="25" y="153" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK] · 🔗 coop_id [FK]</text>
        <text x="25" y="167" fill="#334155" font-size="7.5">month, year, activity_summary</text>
        <text x="25" y="181" fill="#334155" font-size="7.5">achievements, challenges, future_actions</text>
        <text x="25" y="195" fill="#334155" font-size="7.5">status: DRAFT | SUBMITTED | APPR | REJ</text>
        <text x="25" y="209" fill="#334155" font-size="7.5">review_comment, submitted_at, reviewed_at</text>

        <!-- Line Coop -> Reports -->
        <line x1="290" y1="165" x2="245" y2="165" stroke="#2d6a4f" stroke-width="1.5" />
        <text x="260" y="160" font-size="7" fill="#64748b">1..*</text>

        <!-- Entity: documents (LEFT LOWER) -->
        <rect x="15" y="235" width="230" height="85" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="15" y="235" width="230" height="20" rx="6" fill="#40916c" />
        <text x="130" y="249" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">documents (Pièces Justificatives)</text>
        <text x="25" y="268" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK] · 🔗 coop_id [FK]</text>
        <text x="25" y="282" fill="#334155" font-size="7.5">name, file_type, file_size_kb, storage_path</text>
        <text x="25" y="296" fill="#334155" font-size="7.5">category: REPORT | FINANCIAL | LEGAL | OTHER</text>
        <text x="25" y="310" fill="#334155" font-size="7.5">status: PENDING | APPROVED | REJECTED</text>

        <!-- Line Coop -> Documents -->
        <path d="M 290 220 L 245 260" stroke="#2d6a4f" stroke-width="1.5" />

        <!-- Entity: odds & cooperative_odds (RIGHT TOP) -->
        <rect x="535" y="15" width="230" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="535" y="15" width="230" height="20" rx="6" fill="#d97706" />
        <text x="650" y="29" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">odds (Référentiel 17 ODD ONU)</text>
        <text x="545" y="48" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK], number [1..17 UQ]</text>
        <text x="545" y="62" fill="#334155" font-size="7.5">name, name_fr, color, icon</text>
        <text x="545" y="76" fill="#b45309" font-size="7">🔗 coop_odds: associative N:M table</text>

        <!-- Line Coop -> ODDs -->
        <path d="M 490 125 L 535 70" stroke="#d97706" stroke-width="1.5" />
        <text x="510" y="90" font-size="7" fill="#64748b">N..M</text>

        <!-- Entity: conventions (RIGHT MIDDLE) -->
        <rect x="535" y="105" width="230" height="75" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="535" y="105" width="230" height="20" rx="6" fill="#2563eb" />
        <text x="650" y="119" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">conventions (Partenariats F-OCP)</text>
        <text x="545" y="138" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK] · 🔗 coop_id [FK]</text>
        <text x="545" y="152" fill="#334155" font-size="7.5">title, reference, budget (MAD)</text>
        <text x="545" y="166" fill="#334155" font-size="7.5">start_date, end_date, status</text>

        <!-- Line Coop -> Conventions -->
        <line x1="490" y1="145" x2="535" y2="145" stroke="#2563eb" stroke-width="1.5" />

        <!-- Entity: esg_indicators (RIGHT LOWER) -->
        <rect x="535" y="195" width="230" height="65" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="535" y="195" width="230" height="20" rx="6" fill="#059669" />
        <text x="650" y="209" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">esg_indicators (Tri-Factor ESG)</text>
        <text x="545" y="228" fill="#0f172a" font-size="7.5" font-family="'JetBrains Mono'">🔑 id [PK] · 🔗 coop_id [FK]</text>
        <text x="545" y="242" fill="#334155" font-size="7.5">environmental, social, governance [0-100]</text>
        <text x="545" y="256" fill="#334155" font-size="7.5">month, year [UQ composite]</text>

        <!-- Line Coop -> ESG -->
        <path d="M 490 200 L 535 215" stroke="#059669" stroke-width="1.5" />

        <!-- Entity: notifications & audit_logs (BOTTOM) -->
        <rect x="290" y="270" width="230" height="60" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <rect x="290" y="270" width="230" height="18" rx="6" fill="#64748b" />
        <text x="405" y="283" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">notifications & audit_logs</text>
        <text x="300" y="300" fill="#334155" font-size="7">🔔 notif: type, title, message, read, user_id, coop_id</text>
        <text x="300" y="315" fill="#334155" font-size="7">📜 audit: user_id, action, entity, entity_id, detail</text>
      </svg>
    </div>

    <h2>3.2 Dictionnaire de Données des Tables Stratégiques</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Table</th>
          <th style="width: 25%;">Clés & Index Uniques</th>
          <th style="width: 25%;">Colonnes Principales</th>
          <th style="width: 32%;">Règles d'Intégrité & Comportements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>cooperatives</code></td>
          <td><code>id (PK UUID)</code></td>
          <td><code>name, sector, region, city, lat, lng, legal_status, status</code></td>
          <td>Pivot central. Coordonnées GPS requises pour affichage Leaflet. Suppression en cascade sur tables filles.</td>
        </tr>
        <tr>
          <td><code>beneficiary_records</code></td>
          <td><code>id (PK)</code>, <code>(coop_id, month, year) [UQ]</code></td>
          <td><code>women, men, youth, adults, children, disabled, indirect</code></td>
          <td>Contrainte d'unicité mensuelle par coopérative pour interdire les doublons statistiques temporels.</td>
        </tr>
        <tr>
          <td><code>reports</code></td>
          <td><code>id (PK)</code>, <code>(coop_id, month, year) [UQ]</code></td>
          <td><code>activity_summary, achievements, challenges, status, review_comment</code></td>
          <td>Gestion de l'état du rapport (SUBMITTED, APPROVED, REJECTED). Motif de révision stocké en clair.</td>
        </tr>
        <tr>
          <td><code>documents</code></td>
          <td><code>id (PK)</code>, <code>cooperative_id (FK)</code></td>
          <td><code>name, file_type, file_size_kb, category, status, version</code></td>
          <td>Suivi du cycle de vie des justificatifs (Financier, Juridique, Rapport) avec contrôle de version.</td>
        </tr>
        <tr>
          <td><code>conventions</code></td>
          <td><code>id (PK)</code>, <code>cooperative_id (FK)</code></td>
          <td><code>title, reference, budget, start_date, end_date, status</code></td>
          <td>Calcul automatique des échéances (EXPIRING si &le; 60 jours) et suivi du budget subventionné.</td>
        </tr>
        <tr>
          <td><code>esg_indicators</code></td>
          <td><code>id (PK)</code>, <code>(coop_id, month, year) [UQ]</code></td>
          <td><code>environmental, social, governance (0-100)</code></td>
          <td>Scores d'impact normalisés permettant de générer les radars et courbes de maturité RSE.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= SECTION 4 : WORKFLOWS & SÉQUENCES ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 4 · Diagrammes de Séquence & Processus Métier</span>
    </div>

    <h1><span class="section-num">4</span> Workflows & Diagrammes de Séquence</h1>

    <h2>4.1 Workflow de Soumission & Validation d'un Rapport d'Activité</h2>
    <p>
      Le cycle de vie d'un rapport mensuel implique une coordination bidirectionnelle entre le représentant local de la coopérative et l'administrateur de la Fondation OCP, avec mise à jour transactionnelle et génération immédiate de notifications.
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Diagramme de Séquence : Circuit de Validation des Rapports</span>
        <span class="diagram-tag">Flux Transactionnel</span>
      </div>
      <svg viewBox="0 0 780 230" style="width: 100%; height: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
        <rect x="0" y="0" width="780" height="230" fill="#f8fafc" rx="8" />

        <!-- Actors & Lifelines -->
        <!-- Coop Rep -->
        <rect x="30" y="10" width="130" height="24" rx="4" fill="#2d6a4f" />
        <text x="95" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Coopérative Rep</text>
        <line x1="95" y1="34" x2="95" y2="220" stroke="#94a3b8" stroke-dasharray="3,3" />

        <!-- Next.js Server Action -->
        <rect x="220" y="10" width="150" height="24" rx="4" fill="#1b4332" />
        <text x="295" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Server Action / API</text>
        <line x1="295" y1="34" x2="295" y2="220" stroke="#94a3b8" stroke-dasharray="3,3" />

        <!-- Database Layer -->
        <rect x="430" y="10" width="140" height="24" rx="4" fill="#40916c" />
        <text x="500" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Base Drizzle / SQLite</text>
        <line x1="500" y1="34" x2="500" y2="220" stroke="#94a3b8" stroke-dasharray="3,3" />

        <!-- Admin F-OCP -->
        <rect x="620" y="10" width="130" height="24" rx="4" fill="#0f291e" />
        <text x="685" y="26" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Admin Fondation OCP</text>
        <line x1="685" y1="34" x2="685" y2="220" stroke="#94a3b8" stroke-dasharray="3,3" />

        <!-- Step 1: Submit Report -->
        <line x1="95" y1="55" x2="295" y2="55" stroke="#1b4332" stroke-width="1.5" />
        <text x="195" y="50" font-size="7.5" font-weight="600" fill="#1b4332" text-anchor="middle">1. submitReportAction(data)</text>

        <!-- Step 2: Insert / Upsert DB -->
        <line x1="295" y1="75" x2="500" y2="75" stroke="#2d6a4f" stroke-width="1.5" />
        <text x="397" y="70" font-size="7.5" fill="#334155" text-anchor="middle">2. INSERT INTO reports (status='SUBMITTED')</text>

        <!-- Step 3: Trigger Admin Notification -->
        <line x1="295" y1="95" x2="500" y2="95" stroke="#2d6a4f" stroke-width="1.5" />
        <text x="397" y="90" font-size="7.5" fill="#334155" text-anchor="middle">3. INSERT INTO notifications (type='NEW_SUBMISSION')</text>

        <!-- Step 4: Admin views queue -->
        <line x1="685" y1="120" x2="295" y2="120" stroke="#0f291e" stroke-width="1.5" />
        <text x="490" y="115" font-size="7.5" font-weight="600" fill="#0f291e" text-anchor="middle">4. getPendingReports() & review</text>

        <!-- Step 5: Admin Decision (Approve / Reject) -->
        <line x1="685" y1="150" x2="295" y2="150" stroke="#0f291e" stroke-width="1.5" />
        <text x="490" y="145" font-size="7.5" font-weight="600" fill="#0f291e" text-anchor="middle">5. reviewReportAction(id, 'APPROVED' | 'REJECTED', comment)</text>

        <!-- Step 6: Update report & log audit -->
        <line x1="295" y1="175" x2="500" y2="175" stroke="#2d6a4f" stroke-width="1.5" />
        <text x="397" y="170" font-size="7.5" fill="#334155" text-anchor="middle">6. UPDATE reports + INSERT INTO audit_logs</text>

        <!-- Step 7: Notify Coop -->
        <line x1="295" y1="195" x2="95" y2="195" stroke="#1b4332" stroke-width="1.5" stroke-dasharray="2,2" />
        <text x="195" y="190" font-size="7.5" font-weight="600" fill="#1b4332" text-anchor="middle">7. Push Notification & UI Badge Update</text>
      </svg>
    </div>

    <h2>4.2 Pipeline d'Importation Massive CSV (ETL & Validation Ligne par Ligne)</h2>
    <p>
      Le module d'importation CSV permet d'intégrer des lots de plusieurs centaines de coopératives avec détection des anomalies avant persistance transactionnelle :
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Pipeline ETL de Traitement des Fichiers CSV</span>
        <span class="diagram-tag">Importation Massive</span>
      </div>
      <svg viewBox="0 0 780 110" style="width: 100%; height: auto; font-family: 'Plus Jakarta Sans', sans-serif;">
        <rect x="0" y="0" width="780" height="110" fill="#f8fafc" rx="8" />

        <rect x="20" y="30" width="120" height="50" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <text x="80" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">1. Upload Fichier</text>
        <text x="80" y="66" fill="#64748b" font-size="7" text-anchor="middle">Fichier .csv brut</text>

        <line x1="140" y1="55" x2="170" y2="55" stroke="#1b4332" stroke-width="2" />

        <rect x="170" y="30" width="130" height="50" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <text x="235" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">2. Parsing Stream</text>
        <text x="235" y="66" fill="#64748b" font-size="7" text-anchor="middle">PapaParse (Header check)</text>

        <line x1="300" y1="55" x2="330" y2="55" stroke="#1b4332" stroke-width="2" />

        <rect x="330" y="30" width="140" height="50" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <text x="400" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">3. Validation Zod</text>
        <text x="400" y="66" fill="#64748b" font-size="7" text-anchor="middle">Types, GPS, Emails</text>

        <line x1="470" y1="55" x2="500" y2="55" stroke="#1b4332" stroke-width="2" />

        <rect x="500" y="30" width="130" height="50" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" />
        <text x="565" y="52" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">4. Batch Insert</text>
        <text x="565" y="66" fill="#64748b" font-size="7" text-anchor="middle">Drizzle Transaction</text>

        <line x1="630" y1="55" x2="660" y2="55" stroke="#1b4332" stroke-width="2" />

        <rect x="660" y="30" width="105" height="50" rx="6" fill="#dcfce7" stroke="#86efac" stroke-width="1.2" />
        <text x="712" y="52" fill="#166534" font-size="8" font-weight="bold" text-anchor="middle">5. Rapport Audit</text>
        <text x="712" y="66" fill="#15803d" font-size="7" text-anchor="middle">Succès / Erreurs</text>
      </svg>
    </div>
  </div>

  <!-- ================= SECTION 5 : SÉCURITÉ & ANALYTICS ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 5 · Sécurité & Impact Territorial</span>
    </div>

    <h1><span class="section-num">5</span> Sécurité, Gouvernance & Impact Territorial</h1>

    <h2>5.1 Architecture de Sécurité & Gestion des Sessions</h2>
    <div class="grid-2">
      <div class="card-box">
        <h4 style="color:#1b4332;">🔐 Chiffrement & Authentification</h4>
        <ul style="font-size: 8pt;">
          <li><strong>Hachage Robuste :</strong> <code>bcryptjs</code> avec sel adaptatif (coût 10).</li>
          <li><strong>Tokens Stateless JWT :</strong> Signés cryptographiquement via <code>jose</code> (HMAC-SHA256).</li>
          <li><strong>Cookies Sécurisés :</strong> Flag <code>httpOnly: true</code>, <code>sameSite: "lax"</code>, <code>secure: true</code> en production, empêchant les attaques XSS.</li>
        </ul>
      </div>
      <div class="card-box">
        <h4 style="color:#2d6a4f;">🛡️ Cloisonnement Multi-Tenant & RBAC</h4>
        <ul style="font-size: 8pt;">
          <li><strong>Middleware Guard :</strong> Interception au niveau Edge des routes <code>/admin/*</code> et <code>/cooperative/*</code>.</li>
          <li><strong>Scoping au Niveau Requête :</strong> Injection systématique du <code>cooperativeId</code> extrait de la session dans les requêtes de données coopérative.</li>
          <li><strong>Audit Trail Complet :</strong> Traçabilité de chaque action d'approbation ou de modification dans <code>audit_logs</code>.</li>
        </ul>
      </div>
    </div>

    <h2>5.2 Modèle d'Impact Territorial & Scoring ODD / ESG</h2>
    <p>
      La plateforme intègre un référentiel des 12 régions marocaines (de Tanger-Tétouan-Al Hoceïma jusqu'à Dakhla-Oued Ed-Dahab) et des 17 ODD de l'ONU pour délivrer un tableau de bord d'impact ESG haute précision :
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Modèle Mathématique et Agrégation de l'Impact F-OCP</span>
        <span class="diagram-tag">Formules & Métriques</span>
      </div>
      <div class="grid-3">
        <div class="card-box" style="background:#f0fdf4;">
          <h4 style="color:#166534; font-size:8pt;">🌱 Pilier Environnemental (E)</h4>
          <p style="font-size:7.5pt; color:#1e3a2b;">
            Économie d'eau, transition solaire, pratiques agro-écologiques et valorisation des biodéchets.
          </p>
          <div class="badge badge-green">Score E : 0 - 100 pts</div>
        </div>
        <div class="card-box" style="background:#eff6ff;">
          <h4 style="color:#1e40af; font-size:8pt;">🤝 Pilier Social (S)</h4>
          <p style="font-size:7.5pt; color:#1e3a8a;">
            Ratio d'autonomisation féminine, intégration des jeunes ruraux et inclusion des personnes handicapées.
          </p>
          <div class="badge badge-blue">Score S : 0 - 100 pts</div>
        </div>
        <div class="card-box" style="background:#faf5ff;">
          <h4 style="color:#7e22ce; font-size:8pt;">⚖️ Pilier Gouvernance (G)</h4>
          <p style="font-size:7.5pt; color:#581c87;">
            Tenue des assemblées générales, transparence financière et respect des conventions OCP.
          </p>
          <div class="badge badge-purple">Score G : 0 - 100 pts</div>
        </div>
      </div>
    </div>

    <h2>5.3 Moteur d'Exportation Multi-Formats Haute Fidélité</h2>
    <table>
      <thead>
        <tr>
          <th>Format</th>
          <th>Technologie</th>
          <th>Usage Fonctionnel & Valeur Ajoutée</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-green">CSV Brut</span></td>
          <td>PapaParse</td>
          <td>Export brut haute performance pour analyse BI externe et traitement data-science.</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">Excel XLSX</span></td>
          <td>ExcelJS</td>
          <td>Tableur multi-onglets stylisé aux couleurs OCP, en-têtes gelés, formats monétaires et filtres automatiques.</td>
        </tr>
        <tr>
          <td><span class="badge badge-amber">PDF Vectoriel</span></td>
          <td>PDFKit</td>
          <td>Rapport de synthèse officiel destiné à la Direction Générale et aux comités d'audit de la Fondation.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= SECTION 6 : FEUILLE DE ROUTE ================= -->
  <div class="page-break">
    <div class="header-bar">
      <span class="header-doc-title">F-OCP — Conception Technique & Fonctionnelle</span>
      <span class="header-doc-page">Section 6 · Scalabilité & Trajectoire de Déploiement</span>
    </div>

    <h1><span class="section-num">6</span> Scalabilité & Feuille de Route de Déploiement</h1>

    <h2>6.1 Trajectoire d'Industrialisation Cloud (Production-Ready)</h2>
    <p>
      Le passage de l'architecture MVP actuelle (autonome SQLite) vers l'infrastructure Cloud cible pour soutenir 1 700+ coopératives et des millions de bénéficiaires repose sur les jalons techniques suivants :
    </p>

    <div class="diagram-container">
      <div class="diagram-title">
        <span>Matrice de Transition : Architecture Actuelle (MVP) vs Architecture Cloud Cible</span>
        <span class="diagram-tag">Infrastructure & DevOps</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Axe Technique</th>
            <th style="width: 35%;">État Actuel (MVP Fonctionnel)</th>
            <th style="width: 40%;">Cible de Déploiement Cloud (Production Scale)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Persistance Données</strong></td>
            <td>SQLite local (<code>better-sqlite3</code>)</td>
            <td><strong>PostgreSQL Managé</strong> (AWS RDS / Supabase / Azure Database) via Drizzle ORM sans réécriture de code.</td>
          </tr>
          <tr>
            <td><strong>Stockage Fichiers</strong></td>
            <td>Système de fichiers local</td>
            <td><strong>Object Storage S3-compatible</strong> (AWS S3 / Azure Blob) avec URLs signées temporaires et prévisualisation in-app.</td>
          </tr>
          <tr>
            <td><strong>Notifications</strong></td>
            <td>Base de données polling</td>
            <td><strong>WebSockets / SSE</strong> (Server-Sent Events) ou Redis Pub/Sub pour alertes instantanées sans rechargement.</td>
          </tr>
          <tr>
            <td><strong>Authentification</strong></td>
            <td>Identifiants locaux + JWT</td>
            <td><strong>SSO Entreprise</strong> (SAML 2.0 / OAuth2 OCP Corporate Identity) pour les administrateurs et auditeurs.</td>
          </tr>
          <tr>
            <td><strong>Assurance Qualité</strong></td>
            <td>TypeScript strict & Linting</td>
            <td><strong>Tests Automatisés CI/CD</strong> (Vitest pour la logique métier + Playwright pour les tests e2e de validation).</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>6.2 Synthèse & Conclusion</h2>
    <div class="callout callout-success">
      <div style="font-size: 14pt;">✨</div>
      <div>
        <strong>Validation de la Conception :</strong> La plateforme <strong>F-OCP</strong> réunit une conception technique moderne, modulaire et scalable avec un cahier des charges fonctionnel taillé sur mesure pour la Fondation OCP. Elle transforme la gestion des coopératives marocaines en offrant une traçabilité rigoureuse, une transparence totale des validations et une mesure continue de l'impact socio-économique et durable.
      </div>
    </div>

    <div style="margin-top: 35px; border-top: 2px solid #e2e8f0; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 8pt; color: #64748b;">
        <strong>F-OCP Beneficiary Management Platform</strong> · Document Technique de Conception
      </div>
      <div style="font-size: 8pt; color: #1b4332; font-weight: 700;">
        Fondation OCP — Septembre 2026
      </div>
    </div>
  </div>

</body>
</html>`;

fs.writeFileSync(outputPathHtml, htmlContent, "utf-8");
console.log("HTML generated at:", outputPathHtml);

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const command = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPathPdf}" "${outputPathHtml}"`;

try {
  console.log("Executing Chrome headless PDF generation...");
  execSync(command, { stdio: "inherit" });
  console.log("PDF successfully generated at:", outputPathPdf);
} catch (err) {
  console.error("Error generating PDF with Chrome:", err);
  process.exit(1);
}
