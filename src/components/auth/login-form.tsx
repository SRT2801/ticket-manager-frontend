"use client";

import { useActionState, startTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import LoadingSpinner from "@/components/ui/loading-spinner";

const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

interface FormState {
  errors?: Record<string, string>;
  message?: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  async function handleLogin(_state: FormState, formData: FormData): Promise<FormState> {
    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(raw);
    if (!result.success) {
      return {
        errors: Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] || ""])
        ),
      };
    }

    try {
      await login(result.data);
      window.location.href = redirectTo;
      return {};
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesion";
      return { message };
    }
  }

  const [state, action, pending] = useActionState(handleLogin, {});

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="flex flex-col gap-4"
    >
      {state.message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-on-surface-variant">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="rounded-xl border border-glass-stroke bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="admin@ticket-manager.com"
        />
        {state.errors?.email && (
          <p className="text-xs text-red-400">{state.errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-on-surface-variant">
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="rounded-xl border border-glass-stroke bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Admin123!"
        />
        {state.errors?.password && (
          <p className="text-xs text-red-400">{state.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <LoadingSpinner className="h-4 w-4 text-white" />}
        Iniciar sesion
      </button>
    </form>
  );
}
