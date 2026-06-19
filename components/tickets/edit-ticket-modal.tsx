"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest, ApiError } from "@/lib/api";
import type { Ticket, UpdateTicketInput } from "@/lib/types";
import { PRIORITY_LABELS } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface EditTicketModalProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdated: (ticket: Ticket) => void;
}

export default function EditTicketModal({
  ticket,
  onClose,
  onUpdated,
}: EditTicketModalProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [priority, setPriority] = useState(ticket.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Error al actualizar el ticket"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card neo-raised w-full max-w-lg rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">
            Editar Ticket #{ticket.id}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-on-surface-variant transition-all hover:bg-surface-variant/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-title"
              className="text-sm font-medium text-on-surface-variant"
            >
              Titulo
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-glass-stroke bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-description"
              className="text-sm font-medium text-on-surface-variant"
            >
              Descripcion
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none rounded-xl border border-glass-stroke bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-priority"
              className="text-sm font-medium text-on-surface-variant"
            >
              Prioridad
            </label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Ticket["priority"])}
              className="rounded-xl border border-glass-stroke bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {(
                Object.entries(PRIORITY_LABELS) as [
                  Ticket["priority"],
                  string,
                ][]
              ).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-glass-stroke px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-variant/50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <LoadingSpinner className="h-4 w-4 text-on-primary" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
