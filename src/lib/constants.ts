import type { TicketPriority, TicketStatus } from "@/lib/types";

export const API_URL = "/api";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  CLOSED: "Cerrado",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};
