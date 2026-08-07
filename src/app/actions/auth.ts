"use server";

import { verifyCredentials, createSession, destroySession, getSession } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { redirect } from "next/navigation";

export type LoginState = { error?: string } | null;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Identifiants incorrects. Vérifiez votre email et votre mot de passe." };
  }

  await createSession({
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
    cooperativeId: user.cooperativeId,
  });

  await db.insert(auditLogs).values({
    userId: user.userId,
    action: "LOGIN",
    entity: "User",
    entityId: user.userId,
    detail: `Connexion de ${user.name}`,
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/cooperative");
}

export async function logoutAction() {
  const session = await getSession();
  if (session) {
    await db.insert(auditLogs).values({
      userId: session.userId,
      action: "LOGOUT",
      entity: "User",
      entityId: session.userId,
      detail: `Déconnexion de ${session.name}`,
    });
  }
  await destroySession();
  redirect("/login");
}
