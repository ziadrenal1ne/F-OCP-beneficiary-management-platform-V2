"use client";

import dynamic from "next/dynamic";
import type { MapCooperative } from "./cooperative-map";

const CooperativeMap = dynamic(() => import("./cooperative-map").then((m) => m.CooperativeMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Chargement de la carte…
    </div>
  ),
});

export function MapLoader({ cooperatives }: { cooperatives: MapCooperative[] }) {
  return <CooperativeMap cooperatives={cooperatives} />;
}
