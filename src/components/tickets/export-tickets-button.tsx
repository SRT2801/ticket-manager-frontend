"use client";

import { useSearchParams } from "next/navigation";
import ExportButton from "@/components/tickets/export-button";

export default function ExportTicketsButton() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (priority) params.set("priority", priority);

  return (
    <ExportButton
      query={`/reports/tickets/export?${params.toString()}`}
      label="Exportar a Excel"
    />
  );
}
