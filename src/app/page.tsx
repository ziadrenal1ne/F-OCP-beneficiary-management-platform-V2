import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");
  if (session?.role === "COOPERATIVE") redirect("/cooperative");
  redirect("/login");
}
