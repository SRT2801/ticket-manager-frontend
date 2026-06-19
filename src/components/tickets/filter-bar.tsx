"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TicketPriority } from "@/lib/types";
import { PRIORITY_LABELS } from "@/lib/constants";

const STATUSES = ["", "OPEN", "IN_PROGRESS", "CLOSED"] as const;
const STATUS_LABELS_FILTER: Record<string, string> = {
  "": "Todos",
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  CLOSED: "Cerrado",
};

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "";
  const currentPriority = searchParams.get("priority") || "";

  function handleFilterChange(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set("page", "1");
    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <div className="glass-card staggered-entry flex flex-wrap items-center gap-4 rounded-2xl p-6" style={{ animationDelay: "0.1s" }}>
      <div className="min-w-[200px] flex-1">
        <label className="mb-2 block px-1 text-xs font-medium tracking-wider text-on-surface-variant">
          Filtrar por Estado
        </label>
        <div className="flex gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange("status", status)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                currentStatus === status
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-variant/50 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {STATUS_LABELS_FILTER[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden h-12 w-px bg-glass-stroke md:block" />

      <div className="min-w-[150px]">
        <label className="mb-2 block px-1 text-xs font-medium tracking-wider text-on-surface-variant">
          Nivel de Prioridad
        </label>
        <select
          value={currentPriority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="w-full rounded-lg border-none bg-surface-container-lowest text-sm text-on-surface focus:ring-1 focus:ring-primary"
        >
          <option value="">Todas las prioridades</option>
          {(Object.entries(PRIORITY_LABELS) as [TicketPriority, string][]).map(
            ([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
