import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/login-screen";

export const Route = createFileRoute("/")({ component: LoginScreen });
