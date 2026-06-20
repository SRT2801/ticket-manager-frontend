import type { Metadata } from "next";
import { Suspense } from "react";
import AuthPage from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Autenticacion - Ticket Manager",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
