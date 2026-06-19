"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest, ApiError } from "@/lib/api";
import type { PaginatedTickets } from "@/lib/types";
import FilterBar from "@/components/tickets/filter-bar";
import TicketRow from "@/components/tickets/ticket-row";
import Pagination from "@/components/ui/pagination";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import EmptyState from "@/components/ui/empty-state";

export default function TicketList() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PaginatedTickets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (priority) params.set("priority", priority);
        params.set("page", page);
        params.set("limit", limit);
        const result = await apiRequest<PaginatedTickets>(
          `/tickets?${params.toString()}`
        );
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Error al cargar tickets"
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
  }, [status, priority, page, limit]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar />

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {!loading && !error && data && data.data.length === 0 && (
        <EmptyState
          title="No hay tickets"
          description={
            status || priority
              ? "No se encontraron tickets con esos filtros"
              : "Crea tu primer ticket de soporte"
          }
          actionLabel="Crear ticket"
          actionHref="/tickets/new"
        />
      )}

      {!loading && !error && data && data.data.length > 0 && (
        <>
          <div className="space-y-4">
            {data.data.map((ticket, i) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                onEdit={(updated) => {
                  const newData = data.data.map((t) =>
                    t.id === updated.id ? updated : t
                  );
                  setData({ ...data, data: newData });
                }}
              />
            ))}
          </div>
          <div className="border-t border-glass-stroke py-8">
            <Pagination
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              currentPage={data.pagination.page}
              pageSize={data.pagination.limit}
            />
          </div>
        </>
      )}
    </div>
  );
}
