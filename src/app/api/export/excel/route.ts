import { NextResponse } from "next/server";
import { getAllCooperatives } from "@/lib/data";
import { getSession } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const coops = await getAllCooperatives();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fondation OCP — Axe Éco-Social";
  const sheet = workbook.addWorksheet("Coopératives");

  sheet.columns = [
    { header: "Nom", key: "name", width: 32 },
    { header: "Ville", key: "city", width: 16 },
    { header: "Province", key: "province", width: 18 },
    { header: "Région", key: "region", width: 24 },
    { header: "Secteur", key: "sector", width: 20 },
    { header: "Statut", key: "status", width: 12 },
    { header: "Bénéficiaires femmes", key: "women", width: 18 },
    { header: "Bénéficiaires hommes", key: "men", width: 18 },
    { header: "Bénéficiaires indirects", key: "indirect", width: 20 },
    { header: "Téléphone", key: "phone", width: 18 },
    { header: "Email", key: "email", width: 26 },
  ];
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B4332" } };
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  for (const c of coops) {
    sheet.addRow({
      name: c.name, city: c.city, province: c.province, region: c.region, sector: c.sector, status: c.status,
      women: c.beneficiaries?.women ?? 0, men: c.beneficiaries?.men ?? 0, indirect: c.beneficiaries?.indirect ?? 0,
      phone: c.phone, email: c.email,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="cooperatives_focp_${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
