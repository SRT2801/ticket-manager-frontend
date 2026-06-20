"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import { apiBlob, downloadBlob, ApiError } from "@/lib/api";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ExportButtonProps {
  query: string;
  label?: string;
  variant?: "button" | "text";
}

export default function ExportButton({
  query,
  label = "Exportar a Excel",
  variant = "button",
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { blob, filename } = await apiBlob(query);
      if (blob.size === 0) {
        setError("Sin resultados para exportar");
      } else {
        downloadBlob(blob, filename);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al exportar");
    } finally {
      setLoading(false);
    }
  }, [query]);

  if (variant === "text") {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={handleExport}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-on-surface disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {label}
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-glass-stroke bg-surface px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <LoadingSpinner className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {label}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
