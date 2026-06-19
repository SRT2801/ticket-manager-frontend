"use client";

interface DailyCount {
  date: string;
  label: string;
  count: number;
}

interface TrendChartProps {
  dailyCounts: DailyCount[];
}

const BASE_HEIGHT = 8;
const MAX_HEIGHT = 184;

function getBarHeight(count: number, max: number): number {
  if (max === 0) return BASE_HEIGHT;
  return Math.max(BASE_HEIGHT, Math.round((count / max) * MAX_HEIGHT));
}

export default function TrendChart({ dailyCounts }: TrendChartProps) {
  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);
  const total = dailyCounts.reduce((sum, d) => sum + d.count, 0);

  return (
    <div
      className="glass-card neo-raised stagger-in flex flex-col rounded-2xl p-6"
      style={{ animationDelay: "0.7s" }}
    >
      <div className="mb-8">
        <h4 className="text-[24px] font-semibold leading-8 text-on-surface">
          Ultimos 7 Dias
        </h4>
        <p className="text-xs text-on-surface-variant">
          Tickets creados por dia
        </p>
      </div>

      <div className="group flex flex-1 cursor-crosshair items-end justify-between gap-2">
        {dailyCounts.map((day) => {
          const h = getBarHeight(day.count, maxCount);
          const hoverH = Math.min(h + 16, MAX_HEIGHT + 16);
          const isToday =
            day.date === new Date().toISOString().split("T")[0];

          return (
            <div
              key={day.date}
              className="flex w-full flex-col items-center gap-2"
            >
              <div
                style={{ height: hoverH }}
                className="relative flex w-full items-end"
              >
                <div
                  className={`neo-raised w-full rounded-t-lg transition-all duration-700 group-hover:bg-primary/40 ${
                    isToday ? "bg-primary/50" : "bg-primary/20"
                  }`}
                  style={
                    {
                      height: `${h}px`,
                      "--hover-h": `${hoverH}px`,
                    } as React.CSSProperties
                  }
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded border border-glass-stroke bg-surface px-1.5 py-0.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                  {day.count}
                </div>
              </div>
              <span
                className={`text-[10px] ${
                  isToday
                    ? "font-bold text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-glass-stroke bg-surface-container-low/50 p-4">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-medium">Total Semanal</span>
          <span className="font-bold text-primary">{total}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-on-surface-variant">
          <span className="text-xs font-medium">Pico Maximo</span>
          <span className="font-bold text-status-closed">{maxCount}</span>
        </div>
      </div>
    </div>
  );
}
