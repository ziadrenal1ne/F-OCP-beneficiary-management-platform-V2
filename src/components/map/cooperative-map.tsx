"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";

export type MapCooperative = {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  sector: string;
  status: string;
  latitude: number;
  longitude: number;
  beneficiaries?: number;
  odds: { number: number; name: string; color: string }[];
};

const STATUS_LABEL: Record<string, string> = { ACTIVE: "Active", PENDING: "En attente", SUSPENDED: "Suspendue" };

export function CooperativeMap({ cooperatives }: { cooperatives: MapCooperative[] }) {
  return (
    <MapContainer center={[31.5, -6.5]} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%", borderRadius: "inherit" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cooperatives.map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.latitude, c.longitude]}
          radius={7}
          pathOptions={{
            color: "#1B4332",
            fillColor: "#2D6A4F",
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup minWidth={220}>
            <div className="space-y-1.5">
              <p className="font-semibold text-sm leading-tight">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.city}, {c.region} — {c.country}</p>
              <p className="text-xs">{c.sector}</p>
              <div className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" /> {c.beneficiaries?.toLocaleString("fr-FR") ?? "—"} bénéficiaires
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {c.odds.slice(0, 4).map((o) => (
                  <span key={o.number} className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: o.color }}>
                    {o.number}
                  </span>
                ))}
              </div>
              <p className="text-xs pt-1">Statut : {STATUS_LABEL[c.status]}</p>
              <Link href={`/admin/cooperatives/${c.id}`} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Voir le profil <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
