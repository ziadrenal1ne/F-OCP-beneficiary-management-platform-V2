import { NextResponse } from "next/server";
import { getAllCooperatives, getAdminKpis } from "@/lib/data";
import { getSession } from "@/lib/auth";
import PDFDocument from "pdfkit";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const [coops, kpis] = await Promise.all([getAllCooperatives(), getAdminKpis()]);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fillColor("#1B4332").fontSize(20).text("Fondation OCP — Axe Éco-Social", { align: "left" });
  doc.fillColor("#666").fontSize(10).text(`Rapport généré le ${new Date().toLocaleDateString("fr-FR")}`, { align: "left" });
  doc.moveDown(1.5);

  doc.fillColor("#111").fontSize(13).text("Indicateurs clés", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#333");
  const kpiLines = [
    `Coopératives : ${kpis.totalCooperatives}`,
    `Bénéficiaires directs : ${kpis.totalBeneficiaries}`,
    `Femmes : ${kpis.women} | Hommes : ${kpis.men} | Jeunes : ${kpis.youth}`,
    `Bénéficiaires indirects : ${kpis.indirect}`,
    `Documents : ${kpis.totalReports} | Conventions : ${kpis.totalConventions}`,
    `Validations en attente : ${kpis.pendingValidations}`,
  ];
  kpiLines.forEach((line) => doc.text(line));
  doc.moveDown(1.5);

  doc.fontSize(13).fillColor("#111").text("Liste des coopératives", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(9);

  coops.forEach((c, i) => {
    if (doc.y > 740) doc.addPage();
    doc.fillColor("#1B4332").text(`${i + 1}. ${c.name}`, { continued: false });
    doc.fillColor("#555").text(
      `${c.city}, ${c.region} — ${c.sector} — ${c.status} — ${c.beneficiaries ? c.beneficiaries.women + c.beneficiaries.men : 0} bénéficiaires`
    );
    doc.moveDown(0.3);
  });

  doc.end();
  const buffer = await done;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rapport_focp_${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
