"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/api";
import type { TicketStats, Ticket, PaginatedTickets } from "@/lib/types";
import KpiCard from "@/components/dashboard/kpi-card";
import TicketTable from "@/components/dashboard/ticket-table";
import TrendChart from "@/components/dashboard/trend-chart";
import FooterCards from "@/components/dashboard/footer-cards";
import ExportButton from "@/components/tickets/export-button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import EmptyState from "@/components/ui/empty-state";

interface DailyCount {
  date: string;
  label: string;
  count: number;
}

function groupByDay(tickets: Ticket[]): DailyCount[] {
  const today = new Date();
  const days: DailyCount[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];

    const dayLabels = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    days.push({
      date: key,
      label: dayLabels[d.getDay()],
      count: 0,
    });
  }

  for (const ticket of tickets) {
    const ticketDay = new Date(ticket.createdAt).toISOString().split("T")[0];
    const entry = days.find((d) => d.date === ticketDay);
    if (entry) entry.count++;
  }

  return days;
}

export default function DashboardClient() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketTotal, setTicketTotal] = useState(0);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsResult, ticketsResult] = await Promise.all([
          apiRequest<TicketStats>("/tickets/stats"),
          apiRequest<PaginatedTickets>("/tickets?limit=100"),
        ]);

        if (!cancelled) {
          setStats(statsResult);
          setTickets(ticketsResult.data);
          setTicketTotal(ticketsResult.pagination.total);
          setDailyCounts(groupByDay(ticketsResult.data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Error al cargar estadisticas"
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!stats) return null;

  const totalTickets = ticketTotal;
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const closedCount = tickets.filter((t) => t.status === "CLOSED").length;
  const urgentCount = tickets.filter((t) => t.priority === "HIGH").length;

  if (totalTickets === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="No hay tickets todavia"
          description="Crea tu primer ticket de soporte para comenzar"
          actionLabel="Crear ticket"
          actionHref="/tickets/new"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className="stagger-in mb-10 flex items-end justify-between"
        style={{ animationDelay: "0.1s" }}
      >
        <div>
          <h2 className="text-[32px] font-semibold leading-10 tracking-wide text-on-surface">
            Dashboard
          </h2>
          <p className="text-on-surface-variant">
            {urgentCount > 0
              ? `Bienvenido. Tenes ${urgentCount} ticket${urgentCount !== 1 ? "s" : ""} que requieren atencion inmediata.`
              : "Bienvenido. Todo en orden."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/tickets/new"
            className="neo-raised inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold tracking-wider text-on-primary transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </Link>
          <ExportButton
            query="/reports/tickets/export"
            label="Exportar Reporte"
          />
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          label="Total de Tickets"
          value={totalTickets}
          trend="+12%"
          trendColor="#10B981"
          sparklinePath="M0 15 Q 10 12, 20 18 T 40 10 T 60 14 T 80 5 T 100 8"
          sparklineColor="#c0c1ff"
          style={{ animationDelay: "0.2s" }}
        />
        <KpiCard
          icon={<AlertCircle className="h-5 w-5 text-status-progress" />}
          label="Tickets Abiertos"
          value={openCount}
          trend="-5%"
          trendColor="#F43F5E"
          sparklinePath="M0 10 Q 10 18, 20 12 T 40 16 T 60 8 T 80 12 T 100 15"
          sparklineColor="#F59E0B"
          style={{ animationDelay: "0.3s" }}
        />
        <KpiCard
          icon={<CheckCircle className="h-5 w-5 text-status-closed" />}
          label="Resueltos"
          value={closedCount}
          trend="+24%"
          trendColor="#10B981"
          sparklinePath="M0 18 Q 10 15, 20 10 T 40 12 T 60 5 T 80 8 T 100 2"
          sparklineColor="#10B981"
          style={{ animationDelay: "0.4s" }}
        />
        <KpiCard
          icon={<AlertTriangle className="h-5 w-5 text-status-urgent" />}
          label="Urgentes"
          value={urgentCount}
          trend="CRITICO"
          trendColor="#F43F5E"
          sparklinePath="M0 10 L 10 2 L 20 18 L 30 5 L 40 15 L 50 0 L 60 18 L 70 8 L 80 15 L 100 5"
          sparklineColor="#F43F5E"
          urgent
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TicketTable tickets={stats.recent} />
        </div>
        <TrendChart dailyCounts={dailyCounts} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FooterCards total={totalTickets} closed={closedCount} />
      </div>
    </div>
  );
}
