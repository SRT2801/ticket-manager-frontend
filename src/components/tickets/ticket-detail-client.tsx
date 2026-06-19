"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/api";
import type { Ticket, TicketStatus } from "@/lib/types";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import ExportButton from "@/components/tickets/export-button";
import EditTicketModal from "@/components/tickets/edit-ticket-modal";

interface TicketDetailClientProps {
  id: string;
}

const STATUS_OPTIONS: TicketStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];

const statusBtnColors: Record<TicketStatus, string> = {
  OPEN: "border-amber-500/30 text-amber-300 hover:bg-amber-500/10",
  IN_PROGRESS: "border-primary/30 text-primary hover:bg-primary/10",
  CLOSED: "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  HIGH: "bg-red-500/10 text-red-300 border border-red-500/20",
};

export default function TicketDetailClient({ id }: TicketDetailClientProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest<Ticket>(`/tickets/${id}`);
        if (!cancelled) setTicket(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Error al cargar el ticket"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusChange(status: TicketStatus) {
    setUpdating(true);
    setUpdateError(null);
    try {
      const result = await apiRequest<Ticket>(`/tickets/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTicket(result);
      router.refresh();
    } catch (err) {
      setUpdateError(
        err instanceof ApiError ? err.message : "Error al actualizar estado"
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!ticket) return null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <div className="rounded-2xl border border-glass-stroke bg-glass-fill p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-semibold text-on-surface">
              {ticket.title}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                ticket.status === "OPEN"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  : ticket.status === "IN_PROGRESS"
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-on-surface-variant">
              Descripcion
            </h2>
            <p className="whitespace-pre-wrap text-sm text-on-surface">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Prioridad
              </h3>
              <span
                className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityColors[ticket.priority]}`}
              >
                {PRIORITY_LABELS[ticket.priority]}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Estado
              </h3>
              <span
                className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  ticket.status === "OPEN"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                    : ticket.status === "IN_PROGRESS"
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {STATUS_LABELS[ticket.status]}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Creado
              </h3>
              <p className="mt-1 text-sm text-on-surface">
                {new Date(ticket.createdAt).toLocaleString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Actualizado
              </h3>
              <p className="mt-1 text-sm text-on-surface">
                {new Date(ticket.updatedAt).toLocaleString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-on-surface-variant">
              Cambiar estado
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || status === ticket.status}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all ${
                    status === ticket.status
                      ? "cursor-default border-glass-stroke bg-white/3 text-outline"
                      : `${statusBtnColors[status]} border`
                  } disabled:opacity-50`}
                >
                  {STATUS_LABELS[status]}
                  {status === ticket.status && " (actual)"}
                </button>
              ))}
              {updating && <LoadingSpinner className="h-4 w-4" />}
            </div>
            {updateError && (
              <p className="mt-2 text-xs text-red-400">{updateError}</p>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-glass-stroke pt-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-glass-stroke bg-surface px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container-high"
            >
              <Edit className="h-4 w-4" />
              Editar Ticket
            </button>
            <ExportButton
              query={`/reports/tickets/${id}/export`}
              label="Exportar a Excel"
            />
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTicketModal
          ticket={ticket}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setTicket(updated)}
        />
      )}
    </div>
  );
}
