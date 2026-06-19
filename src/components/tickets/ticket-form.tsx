"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState, startTransition } from "react";
import { z } from "zod";
import { apiRequest, ApiError } from "@/lib/api";
import type { CreateTicketInput, Ticket, TicketPriority } from "@/lib/types";
import { PRIORITY_LABELS } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/loading-spinner";

const createTicketSchema = z.object({
  title: z.string().min(1, "El titulo es requerido"),
  description: z.string().min(1, "La descripcion es requerida"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

interface FormState {
  errors?: Record<string, string>;
  message?: string;
}

const PRIORITY_DOTS: Record<string, string> = {
  LOW: "bg-status-closed",
  MEDIUM: "bg-status-progress",
  HIGH: "bg-primary",
};

const PRIORITY_GLOW: Record<string, string> = {
  LOW: "rgba(16, 185, 129, 0.3)",
  MEDIUM: "rgba(245, 158, 11, 0.3)",
  HIGH: "rgba(192, 193, 255, 0.3)",
};

export default function TicketForm() {
  const router = useRouter();
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>("MEDIUM");

  async function handleCreate(
    _state: FormState,
    formData: FormData
  ): Promise<FormState> {
    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: selectedPriority,
    };

    const result = createTicketSchema.safeParse(raw);
    if (!result.success) {
      return {
        errors: Object.fromEntries(
          Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [
            k,
            v?.[0] || "",
          ])
        ),
      };
    }

    try {
      const input: CreateTicketInput = {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
      };
      await apiRequest<Ticket>("/tickets", {
        method: "POST",
        body: JSON.stringify(input),
      });
      router.push("/tickets");
      return {};
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al crear el ticket";
      return { message };
    }
  }

  const [state, action, pending] = useActionState(handleCreate, {});

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="space-y-8"
    >
      {state.message && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <input type="hidden" name="priority" value={selectedPriority} />

      <div>
        <label
          htmlFor="title"
          className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-primary"
        >
          Titulo del Ticket
          <span className="text-status-urgent">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="neo-pressed w-full rounded-lg border-none bg-surface-container-lowest p-4 text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50"
          placeholder="Resume brevemente el problema (ej., Error de latencia en API de Produccion)"
        />
        {state.errors?.title && (
          <p className="mt-1.5 text-xs text-red-400">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-primary"
        >
          Descripcion Detallada
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          className="neo-pressed w-full resize-none rounded-lg border-none bg-surface-container-lowest p-4 text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/50"
          placeholder="Describe los pasos para reproducir, comportamiento esperado vs actual, y cualquier log relevante..."
        />
        {state.errors?.description && (
          <p className="mt-1.5 text-xs text-red-400">
            {state.errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold tracking-wider text-primary">
          Nivel de Prioridad
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(PRIORITY_DOTS) as [TicketPriority, string][]).map(
            ([key, dotColor]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPriority(key)}
                className={`flex flex-col items-center gap-2 rounded-xl border border-glass-stroke bg-surface-container-low p-4 transition-all hover:bg-surface-variant/30 ${
                  selectedPriority === key
                    ? "bg-primary/10 ring-2 ring-primary"
                    : ""
                }`}
                style={
                  selectedPriority === key
                    ? { boxShadow: `0 0 20px -5px ${PRIORITY_GLOW[key]}` }
                    : undefined
                }
              >
                <div className={`h-3 w-3 rounded-full ${dotColor} ${key === "HIGH" ? "animate-pulse" : ""}`} />
                <span className="text-xs font-medium tracking-wider text-on-surface-variant">
                  {PRIORITY_LABELS[key]}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-glass-stroke pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg px-8 py-3 text-sm font-semibold tracking-wider text-on-surface-variant transition-all hover:bg-white/5 hover:text-on-surface"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-10 py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <LoadingSpinner className="mr-2 inline h-4 w-4 text-on-primary" />}
          Crear Ticket
        </button>
      </div>
    </form>
  );
}
