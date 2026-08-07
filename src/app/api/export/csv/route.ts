import { NextResponse } from "next/server";
import { getAllCooperatives } from "@/lib/data";
import { getSession } from "@/lib/auth";

function escapeCsv(v: string | number) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const coops = await getAllCooperatives();
  const headers = ["Nom", "Ville", "Province", "Région", "Secteur", "Statut", "Bénéficiaires directs", "Téléphone", "Email"];
  const lines = [headers.join(",")];
  for (const c of coops) {
    lines.push(
      [
        escapeCsv(c.name), escapeCsv(c.city), escapeCsv(c.province), escapeCsv(c.region),
        escapeCsv(c.sector), escapeCsv(c.status), escapeCsv(c.beneficiaries ? c.beneficiaries.women + c.beneficiaries.men : 0),
        escapeCsv(c.phone), escapeCsv(c.email),
      ].join(",")
    );
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cooperatives_focp_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
