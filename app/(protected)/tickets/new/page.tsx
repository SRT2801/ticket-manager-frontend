import type { Metadata } from "next";
import TicketForm from "@/components/tickets/ticket-form";

export const metadata: Metadata = {
  title: "Nuevo ticket - Ticket Manager",
};

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-4xl px-0 py-3">
      <div className="stagger-in mb-12" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-[32px] font-semibold leading-[40px] tracking-wide text-on-surface">
          Crear Nuevo Ticket
        </h2>
        <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
          Documenta el problema con precision. Los tickets de alta prioridad se
          enrutan automaticamente a la unidad de respuesta urgente.
        </p>
      </div>

      <div
        className="glass-card neo-raised stagger-in rounded-xl p-8"
        style={{ animationDelay: "0.2s" }}
      >
        <TicketForm />
      </div>

      <div
        className="stagger-in mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
        style={{ animationDelay: "0.3s" }}
      >
      </div>
    </div>
  );
}
