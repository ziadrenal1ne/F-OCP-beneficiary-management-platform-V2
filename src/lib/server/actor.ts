import { getSql } from "@/lib/db";
import type { Actor, UserRole } from "@/lib/types";
import { ensureSeeded } from "./seed";

type UserRow = { id: string; email: string | null; name: string | null };
type ProfileRow = { user_id: string; role: UserRole; cooperative_id: number | null; display_name: string | null };

export async function getActor(userId: string): Promise<Actor> {
  await ensureSeeded();
  const sql = await getSql();

  const users = await sql<UserRow>`
    select id, email, name from "user" where id = ${userId} limit 1
  `;
  const user = users[0];
  const email = user?.email?.toLowerCase() ?? null;

  const existing = await sql<ProfileRow>`
    select user_id, role, cooperative_id, display_name from profiles where user_id = ${userId} limit 1
  `;
  if (existing[0]) {
    return {
      userId,
      email,
      name: existing[0].display_name ?? user?.name ?? null,
      role: existing[0].role,
      cooperativeId: existing[0].cooperative_id,
    };
  }

  let role: UserRole = "admin";
  let cooperativeId: number | null = null;
  let displayName = user?.name ?? "Utilisateur";

  if (email === "cooperative@focp.local") {
    role = "cooperative";
    displayName = "Représentant Al Amal";
    const coop = await sql<{ id: number }>`
      select id from cooperatives where name = ${"Coopérative Agricole Al Amal de Khouribga"} limit 1
    `;
    cooperativeId = coop[0]?.id ?? null;
    if (!cooperativeId) {
      const first = await sql<{ id: number }>`select id from cooperatives order by id limit 1`;
      cooperativeId = first[0]?.id ?? null;
    }
  } else if (email === "admin@focp.local") {
    role = "admin";
    displayName = "Administrateur FOCP";
  } else {
    // Google / X / Grok identity — full platform access for this MVP
    role = "admin";
    displayName = user?.name || "Administrateur";
  }

  await sql`
    insert into profiles (user_id, role, cooperative_id, display_name)
    values (${userId}, ${role}, ${cooperativeId}, ${displayName})
    on conflict (user_id) do nothing
  `;

  return { userId, email, name: displayName, role, cooperativeId };
}

export function assertAdmin(actor: Actor) {
  if (actor.role !== "admin") {
    throw new Error("Accès réservé aux administrateurs");
  }
}

export function scopedCoopId(actor: Actor, requested?: number | null): number | null {
  if (actor.role === "cooperative") return actor.cooperativeId;
  return requested ?? null;
}

export async function writeAudit(
  userId: string,
  action: string,
  entityType: string,
  entityId: string | number | null,
  details: string,
) {
  const sql = await getSql();
  await sql`
    insert into audit_logs (user_id, action, entity_type, entity_id, details)
    values (${userId}, ${action}, ${entityType}, ${entityId == null ? null : String(entityId)}, ${details})
  `;
}
