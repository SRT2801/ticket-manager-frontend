"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiRequest, ApiError } from "@/lib/api";
import type { Ticket, TicketPriority, UpdateTicketInput } from "@/lib/types";
import { PRIORITY_LABELS } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface EditTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdated: (ticket: Ticket) => void;
}

const PRIORITY_DOT_COLORS: Record<TicketPriority, string> = {
  LOW: "#10B981",
  MEDIUM: "#F59E0B",
  HIGH: "#F43F5E",
};

export default function EditTicketModal({
  ticket,
  onClose,
  onUpdated,
}: EditTicketModalProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  }

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setClosing(true);
        setTimeout(() => onClose(), 200);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const input: UpdateTicketInput = {};
      if (title !== ticket.title) input.title = title;
      if (description !== ticket.description) input.description = description;
      if (priority !== ticket.priority) input.priority = priority;

      const result = await apiRequest<Ticket>(`/tickets/${ticket.id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      onUpdated(result);
      handleClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Error al actualizar el ticket"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={handleClose}
    >
      <div
        className={`glass-modal relative w-full max-w-lg rounded-[10px] p-10 ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-on-surface-variant/50 transition-colors hover:text-on-surface"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="mb-10">
          <h1 className="text-xl font-medium tracking-tight text-on-surface">
            Editar Ticket{" "}
            <span className="text-on-surface-variant/50">#{ticket.id}</span>
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant/50">
            Actualiza los detalles y la prioridad de la incidencia tecnica.
          </p>
        </header>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="edit-title"
              className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant/60"
            >
              Titulo
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="minimal-input w-full rounded-[10px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/30"
              placeholder="Asunto del ticket..."
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant/60"
            >
              Descripcion
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="minimal-input w-full resize-none rounded-[10px] px-4 py-3 text-[14px] text-on-surface placeholder:text-on-surface-variant/30"
            />
          </div>

          <div>
            <label className="mb-3.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant/60">
              Prioridad
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(PRIORITY_LABELS) as [TicketPriority, string][]).map(
                ([key, label]) => {
                  const color = PRIORITY_DOT_COLORS[key];
                  const isSelected = priority === key;
                  return (
                    <label key={key} className="cursor-pointer">
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="edit-priority"
                        value={key}
                        checked={isSelected}
                        onChange={() => setPriority(key)}
                      />
                      <span
                        className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all"
                        style={
                          isSelected
                            ? {
                                color,
                                background: `${color}0D`,
                                borderColor: `${color}33`,
                                borderWidth: "1px",
                                borderStyle: "solid",
                              }
                            : {
                                color: "#c7c4d7",
                                borderColor: "transparent",
                                borderWidth: "1px",
                                borderStyle: "solid",
                              }
                        }
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
                        />
                        {label}
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-[13px] font-medium text-on-surface-variant/60 transition-colors hover:text-on-surface"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !title.trim()}
              className="rounded-[10px] bg-primary px-6 py-2 text-[13px] font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <LoadingSpinner className="mr-1 inline h-3.5 w-3.5 text-on-primary" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
