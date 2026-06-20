"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User, Eye, Edit } from "lucide-react";
import type { Ticket } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import EditTicketModal from "@/components/tickets/edit-ticket-modal";

const priorityBarColors: Record<string, string> = {
  LOW: "bg-status-closed",
  MEDIUM: "bg-status-progress",
  HIGH: "bg-status-urgent",
};

const statusBadgeColors: Record<string, string> = {
  OPEN: "bg-status-progress/10 text-status-progress border border-status-progress/20",
  IN_PROGRESS: "bg-primary/10 text-primary border border-primary/20",
  CLOSED: "bg-status-closed/10 text-status-closed border border-status-closed/20",
};

interface TicketRowProps {
  ticket: Ticket;
  style?: React.CSSProperties;
  onEdit?: (ticket: Ticket) => void;
}

export default function TicketRow({ ticket, style, onEdit }: TicketRowProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const barColor = priorityBarColors[ticket.priority] || "bg-slate-500";
  const statusBadge = statusBadgeColors[ticket.status] || statusBadgeColors.OPEN;

  function handleUpdated(updated: Ticket) {
    onEdit?.(updated);
  }

  return (
    <>
      <div
        className="glass-card staggered-entry group flex cursor-pointer items-center gap-6 rounded-xl p-5"
        style={style}
        onClick={() => router.push(`/tickets/${ticket.id}`)}
      >
        <div
          className={`h-12 w-2 shrink-0 rounded-full ${barColor}`}
          title={`Prioridad ${PRIORITY_LABELS[ticket.priority]}`}
        />

        <div className="min-w-0 flex-1">
          <span className="truncate text-[24px] font-semibold leading-8 text-on-surface transition-colors group-hover:text-primary">
            {ticket.title}
          </span>
          <div className="mt-1 flex items-center gap-4">
            <span className="text-sm text-on-surface-variant">
              #TK-{ticket.id}
            </span>
            <span className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Calendar className="h-4 w-4" />
              {new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-on-surface-variant">
              <User className="h-4 w-4" />
              {ticket.userName}
            </span>
          </div>
        </div>

        <div className="hidden items-end lg:flex">
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge}`}
          >
            {STATUS_LABELS[ticket.status]}
          </div>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-lg bg-surface-variant/30 p-2 text-primary">
            <Eye className="h-5 w-5" />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="rounded-lg bg-surface-variant/30 p-2 text-secondary transition-all hover:bg-secondary/20"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showModal && (
        <EditTicketModal
          ticket={ticket}
          onClose={() => setShowModal(false)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}
