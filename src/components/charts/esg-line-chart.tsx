"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function EsgLineChart({ data }: { data: { label: string; environmental: number; social: number; governance: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
        <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} stroke="var(--color-muted-foreground)" />
        <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="environmental" name="Environnement" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="social" name="Social" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="governance" name="Gouvernance" stroke="var(--color-gold)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
