import type { ReactNode } from "react";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  trend?: string;
  trendColor?: string;
  sparklinePath: string;
  sparklineColor: string;
  urgent?: boolean;
  style?: React.CSSProperties;
}

export default function KpiCard({
  icon,
  label,
  value,
  trend,
  trendColor,
  sparklinePath,
  sparklineColor,
  urgent,
  style,
}: KpiCardProps) {
  return (
    <div
      className={`glass-card neo-raised stagger-in rounded-2xl p-6 ${
        urgent ? "urgent-pulse" : ""
      }`}
      style={style}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
        {trend && (
          <span className="text-xs font-bold" style={{ color: trendColor }}>
            {trend}
          </span>
        )}
      </div>
      <p className="mb-1 text-sm font-semibold tracking-wider text-on-surface-variant">
        {label}
      </p>
      <h3 className="mb-4 text-[48px] font-bold leading-14 tracking-wider text-on-surface">
        {value.toLocaleString()}
      </h3>
      <div className="h-10 w-full">
        <svg className="h-full w-full" viewBox="0 0 100 20">
          <path
            className="sparkline-path"
            d={sparklinePath}
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
