import type { Metadata } from "next";
import TicketDetailClient from "@/components/tickets/ticket-detail-client";

export const metadata: Metadata = {
  title: "Detalle del ticket - Ticket Manager",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketDetailClient id={id} />;
}
