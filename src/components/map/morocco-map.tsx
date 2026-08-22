import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Cooperative } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type Props = {
  cooperatives: Cooperative[];
};

export function MoroccoMap({ cooperatives }: Props) {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="h-[520px] w-full animate-pulse rounded-2xl bg-muted" />;
  }

  return <LeafletMap cooperatives={cooperatives} onOpen={(id) => navigate({ to: "/cooperatives/$id", params: { id: String(id) } })} />;
}

function LeafletMap({
  cooperatives,
  onOpen,
}: {
  cooperatives: Cooperative[];
  onOpen: (id: number) => void;
}) {
  const leaflet = useMemo(() => {
    // loaded in inner component after mount
    return null;
  }, []);
  void leaflet;
  return <MapInner cooperatives={cooperatives} onOpen={onOpen} />;
}

function MapInner({
  cooperatives,
  onOpen,
}: {
  cooperatives: Cooperative[];
  onOpen: (id: number) => void;
}) {
  const [Lmod, setLmod] = useState<null | typeof import("react-leaflet")>(null);

  useEffect(() => {
    void Promise.all([import("leaflet"), import("react-leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([L, rl]) => {
        const icon = L.divIcon({
          className: "coop-marker",
          html: `<span class="coop-marker-dot"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8],
        });
        L.Marker.prototype.options.icon = icon;
        setLmod(rl);
      },
    );
  }, []);

  if (!Lmod) return <div className="h-[520px] w-full animate-pulse rounded-2xl bg-muted" />;

  const { MapContainer, TileLayer, Marker, Popup } = Lmod;

  return (
    <MapContainer
      center={[31.8, -7.1]}
      zoom={6}
      className="h-[520px] w-full rounded-2xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {cooperatives.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          eventHandlers={{
            click: () => onOpen(c.id),
          }}
        >
          <Popup>
            <div className="min-w-44 text-sm">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {c.city} · {c.region}
              </p>
              <p className="mt-1 text-xs">
                {c.sector} · {c.status === "active" ? "Active" : c.status}
              </p>
              <p className="text-xs tabular-nums">{formatNumber(c.totalDirect)} bénéficiaires</p>
              <p className="mt-1 text-xs">{c.odds.map((o) => `ODD ${o.code}`).join(" · ")}</p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-primary"
                onClick={() => onOpen(c.id)}
              >
                Ouvrir le profil
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
