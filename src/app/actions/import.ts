"use server";

import { db } from "@/db";
import { cooperatives, auditLogs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";

export type ImportResult = {
  success: boolean;
  inserted: number;
  errors: { row: number; message: string }[];
} | null;

const REQUIRED_COLUMNS = ["name", "city", "province", "region", "sector", "phone", "email", "latitude", "longitude"];

export async function importCooperativesCsv(_prev: ImportResult, formData: FormData): Promise<ImportResult> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, inserted: 0, errors: [{ row: 0, message: "Non autorisé." }] };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, inserted: 0, errors: [{ row: 0, message: "Merci de sélectionner un fichier CSV." }] };
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  const errors: { row: number; message: string }[] = [];
  const headers = parsed.meta.fields ?? [];
  const missingCols = REQUIRED_COLUMNS.filter((c) => !headers.includes(c));
  if (missingCols.length > 0) {
    return {
      success: false,
      inserted: 0,
      errors: [{ row: 0, message: `Colonnes manquantes : ${missingCols.join(", ")}. Colonnes requises : ${REQUIRED_COLUMNS.join(", ")}.` }],
    };
  }

  let inserted = 0;
  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    const rowNum = i + 2; // account for header row

    if (!row.name?.trim()) { errors.push({ row: rowNum, message: "Nom de la coopérative manquant." }); continue; }
    if (!row.city?.trim()) { errors.push({ row: rowNum, message: "Ville manquante." }); continue; }
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) { errors.push({ row: rowNum, message: "Coordonnées GPS invalides." }); continue; }
    if (row.email && !/^\S+@\S+\.\S+$/.test(row.email)) { errors.push({ row: rowNum, message: "Adresse email invalide." }); continue; }

    try {
      await db.insert(cooperatives).values({
        name: row.name.trim(),
        description: row.description?.trim() || `Coopérative importée le ${new Date().toLocaleDateString("fr-FR")}.`,
        address: row.address?.trim() || `${row.city}, ${row.province ?? ""}`,
        city: row.city.trim(),
        province: row.province?.trim() || row.city.trim(),
        region: row.region?.trim() || "Non spécifiée",
        country: row.country?.trim() || "Maroc",
        latitude: lat,
        longitude: lng,
        phone: row.phone?.trim() || "N/A",
        email: row.email?.trim() || `contact@${row.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "")}.ma`,
        website: row.website?.trim() || null,
        sector: row.sector?.trim() || "Non spécifié",
        legalStatus: row.legalStatus?.trim() || "Coopérative",
        creationDate: row.creationDate ? new Date(row.creationDate) : new Date(),
        status: "PENDING",
      });
      inserted++;
    } catch (e) {
      errors.push({ row: rowNum, message: "Erreur lors de l'insertion en base de données." });
    }
  }

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "IMPORT",
    entity: "Cooperative",
    detail: `Import CSV : ${inserted} coopérative(s) insérée(s), ${errors.length} erreur(s)`,
  });

  revalidatePath("/admin/cooperatives");
  revalidatePath("/admin");
  revalidatePath("/admin/map");

  return { success: errors.length === 0, inserted, errors };
}
