"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PersonStanding,
  CalendarDays,
  Clock,
  FileText,
  Edit,
  Radio,
  Pencil,
  CheckCircle,
} from "lucide-react";
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

const statusConfig: Record<
  TicketStatus,
  { icon: React.ElementType; barColor: string; activeBg: string; activeBorder: string; activeText: string; hoverBg: string; hoverText: string; hoverBorder: string }
> = {
  OPEN: {
    icon: Radio,
    barColor: "bg-amber-500",
    activeBg: "bg-amber-500/10",
    activeBorder: "border-amber-500/30",
    activeText: "text-amber-500",
    hoverBg: "hover:bg-amber-500/10",
    hoverText: "hover:text-amber-400",
    hoverBorder: "hover:border-amber-500/20",
  },
  IN_PROGRESS: {
    icon: Pencil,
    barColor: "bg-primary",
    activeBg: "bg-primary/10",
    activeBorder: "border-primary/30",
    activeText: "text-primary",
    hoverBg: "hover:bg-primary/10",
    hoverText: "hover:text-primary",
    hoverBorder: "hover:border-primary/20",
  },
  CLOSED: {
    icon: CheckCircle,
    barColor: "bg-emerald-500",
    activeBg: "bg-emerald-500/10",
    activeBorder: "border-emerald-500/30",
    activeText: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    hoverText: "hover:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/20",
  },
};

const priorityColors: Record<string, string> = {
  LOW: "bg-status-closed/10 text-status-closed border border-status-closed/20",
  MEDIUM: "bg-status-progress/10 text-status-progress border border-status-progress/20",
  HIGH: "bg-status-urgent/10 text-status-urgent border border-status-urgent/20",
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
            err instanceof ApiError ? err.message : "Error al cargar el ticket"
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
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-lg font-bold text-primary">
              #TK-{ticket.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                ticket.status === "OPEN"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                  : ticket.status === "IN_PROGRESS"
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                  ticket.status === "OPEN"
                    ? "bg-amber-500"
                    : ticket.status === "IN_PROGRESS"
                      ? "bg-primary"
                      : "bg-emerald-500"
                }`}
              />
              {STATUS_LABELS[ticket.status]}
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${priorityColors[ticket.priority]}`}
            >
              {PRIORITY_LABELS[ticket.priority]}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            {ticket.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110"
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                Creado por
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-surface-container-high">
                  <PersonStanding className="h-4 w-4" />
                </div>
                <span className="font-medium text-on-surface">
                  {ticket.userName}
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                Fecha Creacion
              </p>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-on-surface-variant" />
                <span className="font-medium text-on-surface">
                  {new Date(ticket.createdAt).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
                Ultima Actualizacion
              </p>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-on-surface-variant" />
                <span className="font-medium text-on-surface">
                  {new Date(ticket.updatedAt).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden rounded-3xl p-8">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary/50" />
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">
                Descripcion
              </h3>
            </div>
            <div className="max-w-none">
              <p className="leading-relaxed text-on-surface-variant">
                {ticket.description}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card rounded-2xl p-5 ">
            <div className="mb-6 flex items-center gap-3">
              <h3 className="font-bold text-on-surface">Cambiar Estado</h3>
            </div>
            {updateError && (
              <p className="mb-4 text-xs text-red-400">{updateError}</p>
            )}
            <div className="space-y-3">
              {STATUS_OPTIONS.map((status) => {
                const cfg = statusConfig[status];
                const isActive = status === ticket.status;
                const Icon = cfg.icon;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || isActive}
                    className={`flex w-full items-center justify-between rounded-2xl p-4 text-left font-bold transition-all ${
                      isActive
                        ? `${cfg.activeBg} border-2 ${cfg.activeBorder} ${cfg.activeText}`
                        : `border border-white/5 bg-white/5 text-on-surface-variant ${cfg.hoverBg} ${cfg.hoverText} ${cfg.hoverBorder}`
                    } disabled:cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{STATUS_LABELS[status]}</span>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-black uppercase opacity-60">
                        Actual
                      </span>
                    )}
                    {!isActive && !updating && (
                      <span className="text-lg opacity-0 transition-opacity group-hover:opacity-100">
                        &rarr;
                      </span>
                    )}
                    {updating && !isActive && (
                      <LoadingSpinner className="h-4 w-4" />
                    )}
                  </button>
                );
              })}
            </div>
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
