"use server";

import { db } from "@/db";
import { cooperatives, beneficiaryRecords, reports, documents, notifications, auditLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireCooperativeSession() {
  const session = await getSession();
  if (!session || session.role !== "COOPERATIVE" || !session.cooperativeId) {
    throw new Error("Non autorisé");
  }
  return session;
}
async function requireAdminSession() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Non autorisé");
  return session;
}

export async function updateCooperativeProfile(formData: FormData) {
  const session = await requireCooperativeSession();
  const id = session.cooperativeId!;

  await db.update(cooperatives).set({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    address: String(formData.get("address") ?? ""),
    city: String(formData.get("city") ?? ""),
    province: String(formData.get("province") ?? ""),
    region: String(formData.get("region") ?? ""),
    country: String(formData.get("country") ?? "Maroc"),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? "") || null,
    sector: String(formData.get("sector") ?? ""),
    legalStatus: String(formData.get("legalStatus") ?? ""),
    updatedAt: new Date(),
  }).where(eq(cooperatives.id, id));

  await db.insert(auditLogs).values({
    userId: session.userId, action: "UPDATE", entity: "Cooperative", entityId: id, detail: "Mise à jour du profil coopérative",
  });

  revalidatePath("/cooperative/profile");
  revalidatePath("/cooperative");
}

export async function updateBeneficiaryRecord(formData: FormData) {
  const session = await requireCooperativeSession();
  const id = session.cooperativeId!;
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));

  const values = {
    women: Number(formData.get("women") ?? 0),
    men: Number(formData.get("men") ?? 0),
    youth: Number(formData.get("youth") ?? 0),
    adults: Number(formData.get("adults") ?? 0),
    children: Number(formData.get("children") ?? 0),
    disabled: Number(formData.get("disabled") ?? 0),
    indirect: Number(formData.get("indirect") ?? 0),
  };

  const [existing] = await db.select().from(beneficiaryRecords).where(
    and(eq(beneficiaryRecords.cooperativeId, id), eq(beneficiaryRecords.month, month), eq(beneficiaryRecords.year, year))
  );

  if (existing) {
    await db.update(beneficiaryRecords).set(values).where(eq(beneficiaryRecords.id, existing.id));
  } else {
    await db.insert(beneficiaryRecords).values({ cooperativeId: id, month, year, ...values });
  }

  await db.insert(auditLogs).values({
    userId: session.userId, action: "UPDATE", entity: "BeneficiaryRecord", entityId: id, detail: `Mise à jour des statistiques bénéficiaires ${month}/${year}`,
  });

  revalidatePath("/cooperative/beneficiaries");
  revalidatePath("/cooperative");
}

export async function submitMonthlyReport(formData: FormData) {
  const session = await requireCooperativeSession();
  const id = session.cooperativeId!;
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));

  const [coop] = await db.select().from(cooperatives).where(eq(cooperatives.id, id));

  const values = {
    activitySummary: String(formData.get("activitySummary") ?? ""),
    beneficiariesReached: Number(formData.get("beneficiariesReached") ?? 0),
    achievements: String(formData.get("achievements") ?? ""),
    challenges: String(formData.get("challenges") ?? ""),
    futureActions: String(formData.get("futureActions") ?? ""),
    status: "SUBMITTED" as const,
    reviewComment: null,
    reviewedAt: null,
  };

  const [existing] = await db.select().from(reports).where(
    and(eq(reports.cooperativeId, id), eq(reports.month, month), eq(reports.year, year))
  );

  if (existing) {
    await db.update(reports).set(values).where(eq(reports.id, existing.id));
  } else {
    await db.insert(reports).values({ cooperativeId: id, month, year, ...values });
  }

  // Notify admins (find admin users)
  const { users } = await import("@/db/schema");
  const admins = await db.select().from(users).where(eq(users.role, "ADMIN"));
  for (const admin of admins) {
    await db.insert(notifications).values({
      userId: admin.id,
      cooperativeId: id,
      type: "NEW_SUBMISSION",
      title: "Nouveau rapport soumis",
      message: `${coop?.name} a soumis son rapport mensuel.`,
    });
  }

  await db.insert(auditLogs).values({
    userId: session.userId, action: "SUBMIT", entity: "Report", entityId: id, detail: `Soumission du rapport mensuel ${month}/${year}`,
  });

  revalidatePath("/cooperative/reports");
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}

export async function uploadDocument(formData: FormData) {
  const session = await requireCooperativeSession();
  const id = session.cooperativeId!;
  const file = formData.get("file") as File | null;
  const category = String(formData.get("category") ?? "OTHER");

  if (!file || file.size === 0) throw new Error("Fichier requis");

  await db.insert(documents).values({
    cooperativeId: id,
    name: file.name,
    fileType: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
    fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
    category: category as any,
    status: "PENDING",
    ownerName: session.name,
  });

  await db.insert(auditLogs).values({
    userId: session.userId, action: "CREATE", entity: "Document", entityId: id, detail: `Téléversement de ${file.name}`,
  });

  revalidatePath("/cooperative/documents");
  revalidatePath("/admin/documents");
}

// --- Admin actions ---

export async function reviewReport(formData: FormData) {
  const session = await requireAdminSession();
  const reportId = String(formData.get("reportId"));
  const decision = String(formData.get("decision")) as "APPROVED" | "REJECTED";
  const comment = String(formData.get("comment") ?? "");

  const [report] = await db.select().from(reports).where(eq(reports.id, reportId));
  if (!report) throw new Error("Rapport introuvable");

  await db.update(reports).set({
    status: decision,
    reviewComment: comment || null,
    reviewedAt: new Date(),
  }).where(eq(reports.id, reportId));

  const { users } = await import("@/db/schema");
  const [coopUser] = await db.select().from(users).where(eq(users.cooperativeId, report.cooperativeId));
  if (coopUser) {
    await db.insert(notifications).values({
      userId: coopUser.id,
      cooperativeId: report.cooperativeId,
      type: decision === "APPROVED" ? "REPORT_APPROVED" : "REPORT_REJECTED",
      title: decision === "APPROVED" ? "Rapport approuvé" : "Rapport rejeté",
      message: decision === "APPROVED"
        ? "Votre rapport mensuel a été validé par l'administrateur."
        : `Votre rapport a été rejeté. ${comment}`,
    });
  }

  await db.insert(auditLogs).values({
    userId: session.userId, action: decision, entity: "Report", entityId: reportId, detail: `Rapport ${decision === "APPROVED" ? "approuvé" : "rejeté"}`,
  });

  revalidatePath("/admin/reports");
  revalidatePath("/admin");
  revalidatePath("/cooperative/reports");
}

export async function reviewDocument(formData: FormData) {
  const session = await requireAdminSession();
  const documentId = String(formData.get("documentId"));
  const decision = String(formData.get("decision")) as "APPROVED" | "REJECTED";

  const [doc] = await db.select().from(documents).where(eq(documents.id, documentId));
  if (!doc) throw new Error("Document introuvable");

  await db.update(documents).set({ status: decision }).where(eq(documents.id, documentId));

  const { users } = await import("@/db/schema");
  const [coopUser] = await db.select().from(users).where(eq(users.cooperativeId, doc.cooperativeId));
  if (coopUser && decision === "REJECTED") {
    await db.insert(notifications).values({
      userId: coopUser.id,
      cooperativeId: doc.cooperativeId,
      type: "DOCUMENT_REJECTED",
      title: "Document rejeté",
      message: `Le document "${doc.name}" a été rejeté. Merci de le mettre à jour.`,
    });
  }

  await db.insert(auditLogs).values({
    userId: session.userId, action: decision, entity: "Document", entityId: documentId, detail: `Document ${decision === "APPROVED" ? "approuvé" : "rejeté"}`,
  });

  revalidatePath("/admin/documents");
}

export async function markNotificationRead(formData: FormData) {
  const notifId = String(formData.get("notificationId"));
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, notifId));
  revalidatePath("/admin/notifications");
  revalidatePath("/cooperative/notifications");
}
