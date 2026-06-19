import { Clock, Smile, Activity } from "lucide-react";

interface FooterCardsProps {
  total: number;
  closed: number;
}

export default function FooterCards({ total, closed }: FooterCardsProps) {
  const rate = total > 0 ? Math.round((closed / total) * 100) : 0;

  return (
    <>
      <div
        className="glass-card neo-raised stagger-in flex items-center gap-4 rounded-2xl p-6"
        style={{ animationDelay: "0.8s" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-closed/20">
          <Clock className="h-6 w-6 text-status-closed" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wider text-on-surface-variant">
            Tasa de Resolucion
          </p>
          <h5 className="text-xl font-bold text-on-surface">{rate}%</h5>
        </div>
      </div>
      <div
        className="glass-card neo-raised stagger-in flex items-center gap-4 rounded-2xl p-6"
        style={{ animationDelay: "0.85s" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <Smile className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wider text-on-surface-variant">
            Satisfaccion del Cliente
          </p>
          <h5 className="text-xl font-bold text-on-surface">4.8 / 5.0</h5>
        </div>
      </div>
      <div
        className="glass-card neo-raised stagger-in flex items-center gap-4 rounded-2xl p-6"
        style={{ animationDelay: "0.9s" }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-progress/20">
          <Activity className="h-6 w-6 text-status-progress" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wider text-on-surface-variant">
            Salud del Servicio API
          </p>
          <div className="flex items-center gap-2">
            <h5 className="text-xl font-bold text-on-surface">Operativo</h5>
            <span className="h-2 w-2 animate-pulse rounded-full bg-status-closed" />
          </div>
        </div>
      </div>
    </>
  );
}
