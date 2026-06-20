import type { Ticket } from "@/lib/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";

const priorityConfig: Record<string,{ bg: string; text: string; dot: string }> = {
  LOW: {
    bg: "bg-status-closed/10",
    text: "text-status-closed",
    dot: "bg-status-closed",
  },
  MEDIUM: {
    bg: "bg-status-progress/10",
    text: "text-status-progress",
    dot: "bg-status-progress",
  },
  HIGH: {
    bg: "bg-status-urgent/10",
    text: "text-status-urgent",
    dot: "bg-status-urgent",
  },
};

const statusConfig: Record<string, string> = {
  OPEN: "bg-status-progress/10 text-status-progress",
  IN_PROGRESS: "bg-primary/10 text-primary",
  CLOSED: "bg-status-closed/10 text-status-closed",
};

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div
      className="glass-card neo-raised stagger-in overflow-hidden rounded-2xl"
      style={{ animationDelay: "0.6s" }}
    >
      <div className="flex items-center justify-between border-b border-glass-stroke p-6">
        <h4 className="text-[24px] font-semibold leading-8 text-on-surface">
          Tickets Recientes
        </h4>
        <Link
          href="/tickets"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Ver Todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-glass-stroke bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
              <th className="px-6 py-4">Asunto</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Prioridad</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-stroke">
            {tickets.map((ticket) => {
              const pc = priorityConfig[ticket.priority] || priorityConfig.LOW;
              return (
                <tr
                  key={ticket.id}
                  className="group cursor-pointer transition-colors hover:bg-primary/5"
                  onClick={() => {
                    window.location.href = `/tickets/${ticket.id}`;
                  }}
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface transition-colors group-hover:text-primary">
                        {ticket.title}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        #TK-{ticket.id} &bull; {getTimeAgo(ticket.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-medium">
                        {ticket.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-on-surface-variant">
                        {ticket.userName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tighter ${pc.bg} ${pc.text}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${pc.dot}`}
                      />
                      {PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tighter ${statusConfig[ticket.status]}`}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
