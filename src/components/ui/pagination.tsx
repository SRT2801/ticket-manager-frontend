"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export default function Pagination({
  totalPages,
  totalItems,
  currentPage,
  pageSize,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [goTo, setGoTo] = useState(String(currentPage));

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  function handleGoTo() {
    const n = parseInt(goTo, 10);
    if (n >= 1 && n <= totalPages) {
      goToPage(n);
    }
  }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <div className="text-sm text-on-surface-variant">
        Mostrando{" "}
        <span className="font-bold text-on-surface">
          {from} - {to}
        </span>{" "}
        de{" "}
        <span className="font-bold text-on-surface">{totalItems}</span> tickets
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke text-on-surface-variant transition-all hover:bg-surface-variant disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke text-on-surface-variant transition-all hover:bg-surface-variant"
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-on-surface-variant">...</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              p === currentPage
                ? "bg-primary text-on-primary"
                : "border border-glass-stroke text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-2 text-on-surface-variant">...</span>
            )}
            <button
              onClick={() => goToPage(totalPages)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke text-on-surface-variant transition-all hover:bg-surface-variant"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-stroke text-on-surface-variant transition-all hover:bg-surface-variant disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-on-surface-variant">Ir a pagina</span>
        <input
          className="neomorphic-sunken h-10 w-12 rounded-lg border-none bg-surface-container-lowest text-center text-sm text-on-surface"
          type="text"
          value={goTo}
          onChange={(e) => setGoTo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
        />
      </div>
    </div>
  );
}
