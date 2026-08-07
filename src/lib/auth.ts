import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, cooperatives } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "focp-dev-secret-please-change-in-production-0001"
);
const COOKIE_NAME = "focp_session";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "COOPERATIVE";
  cooperativeId: string | null;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function verifyCredentials(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  let cooperativeName: string | null = null;
  if (user.cooperativeId) {
    const [coop] = await db.select().from(cooperatives).where(eq(cooperatives.id, user.cooperativeId));
    cooperativeName = coop?.name ?? null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    cooperativeId: user.cooperativeId,
    cooperativeName,
  };
}
