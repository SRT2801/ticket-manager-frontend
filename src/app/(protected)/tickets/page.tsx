import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import TicketList from "@/components/tickets/ticket-list";
import ExportButton from "@/components/tickets/export-button";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Tickets - Ticket Manager",
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[32px] font-semibold leading-10 tracking-wide text-on-surface">
            Explora los Tickets
          </h2>
          <p className="text-sm text-on-surface-variant">
            Gestiona y explora todos los tickets de soporte.
          </p>
        </div>
        <div className="flex gap-4">
          <ExportButton
            query="/reports/tickets/export"
            label="Exportar a Excel"
          />
          <Link
            href="/tickets/new"
            className="neomorphic-raised inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </Link>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        }
      >
        <TicketList />
      </Suspense>
    </div>
  );
}
