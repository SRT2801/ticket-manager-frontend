"use client";

import { useState } from "react";
import { useActionState, startTransition } from "react";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { ArrowRight, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
});

type FormState = {
  errors?: Record<string, string>;
  message?: string;
};

export default function AuthPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(_state: FormState, formData: FormData): Promise<FormState> {
    const result = loginSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (!result.success) {
      return { errors: Object.fromEntries(Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] || ""])) };
    }
    try {
      await login(result.data);
      window.location.href = "/dashboard";
      return {};
    } catch (err: unknown) {
      return { message: err instanceof Error ? err.message : "Error al iniciar sesion" };
    }
  }

  async function handleRegister(_state: FormState, formData: FormData): Promise<FormState> {
    const result = registerSchema.safeParse({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (!result.success) {
      return { errors: Object.fromEntries(Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] || ""])) };
    }
    try {
      await register(result.data);
      window.location.href = "/dashboard";
      return {};
    } catch (err: unknown) {
      return { message: err instanceof Error ? err.message : "Error al registrarse" };
    }
  }

  const [loginState, loginAction, loginPending] = useActionState(handleLogin, {});
  const [registerState, registerAction, registerPending] = useActionState(handleRegister, {});

  const currentState = mode === "login" ? loginState : registerState;
  const pending = mode === "login" ? loginPending : registerPending;

  return (
    <div className="w-full max-w-105">
      <div className="mb-5 flex flex-col items-center text-center">
    
        <h1 className="text-[32px] font-bold leading-10 tracking-tight text-primary">
          Ticket Manager
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant opacity-80">
          Excelencia en soporte empresarial
        </p>
      </div>

      <div className="glass-card overflow-hidden rounded-4xl p-6 shadow-2xl md:p-8">
        <div className="neo-inset mb-6 flex rounded-xl p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold tracking-wider transition-all duration-300 ${
              mode === "login"
                ? "bg-primary-container/10 text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold tracking-wider transition-all duration-300 ${
              mode === "register"
                ? "bg-primary-container/10 text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Register
          </button>
        </div>

        {currentState.message && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {currentState.message}
          </div>
        )}

        <div className="relative" style={{ perspective: "1200px", minHeight: mode === "login" ? "230px" : "310px" }}>
          <div
            className="transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: mode === "register" ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <form
              action={(formData) => startTransition(() => loginAction(formData))}
              className="space-y-5"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-medium tracking-wider text-on-surface-variant">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      name="email"
                      type="email"
                      className="auth-input w-full rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface"
                      placeholder="name@enterprise.com"
                    />
                  </div>
                  {loginState.errors?.email && (
                    <p className="mt-1 ml-1 text-xs text-red-400">{loginState.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-medium tracking-wider text-on-surface-variant">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="auth-input w-full rounded-xl py-3 pl-12 pr-12 text-sm text-on-surface"
                      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginState.errors?.password && (
                    <p className="mt-1 ml-1 text-xs text-red-400">{loginState.errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="neo-button flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container py-3 text-sm font-semibold tracking-wider text-on-primary-container transition-all disabled:opacity-50"
              >
                {pending && <LoadingSpinner className="h-4 w-4 text-on-primary-container" />}
                Sign In
                {!pending && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <form
              action={(formData) => startTransition(() => registerAction(formData))}
              className="absolute inset-0 space-y-5"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-medium tracking-wider text-on-surface-variant">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      name="name"
                      type="text"
                      className="auth-input w-full rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface"
                      placeholder="John Doe"
                    />
                  </div>
                  {registerState.errors?.name && (
                    <p className="mt-1 ml-1 text-xs text-red-400">{registerState.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-medium tracking-wider text-on-surface-variant">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      name="email"
                      type="email"
                      className="auth-input w-full rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface"
                      placeholder="name@enterprise.com"
                    />
                  </div>
                  {registerState.errors?.email && (
                    <p className="mt-1 ml-1 text-xs text-red-400">{registerState.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 ml-1 block text-xs font-medium tracking-wider text-on-surface-variant">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="auth-input w-full rounded-xl py-3 pl-12 pr-4 text-sm text-on-surface"
                      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    />
                  </div>
                  {registerState.errors?.password && (
                    <p className="mt-1 ml-1 text-xs text-red-400">{registerState.errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="neo-button flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold tracking-wider text-on-primary transition-all disabled:opacity-50"
              >
                {pending && <LoadingSpinner className="h-4 w-4 text-on-primary" />}
                Create Account
                {!pending && <UserPlus className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
