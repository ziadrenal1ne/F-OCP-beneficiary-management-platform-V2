import { existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const dbPath = path.join(process.cwd(), "focp.db");

if (existsSync(dbPath)) {
  console.log("✔ Base de données déjà initialisée (focp.db trouvée). Aucune action nécessaire.");
  console.log("  Pour réinitialiser les données de démonstration : npm run db:reset");
  process.exit(0);
}

console.log("→ Première installation détectée : initialisation de la base de données...");
execSync("npx drizzle-kit push --force", { stdio: "inherit" });
console.log("→ Génération des données de démonstration (50 coopératives, historique 12 mois)...");
execSync("npx tsx src/db/seed.ts", { stdio: "inherit" });
console.log("✔ Base de données prête.");
