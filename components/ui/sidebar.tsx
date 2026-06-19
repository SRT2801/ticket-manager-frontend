"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Ticket,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-glass-stroke bg-surface-container-low px-4 py-6">
      <div className="mb-10 px-4">
        <h1 className="text-[24px] font-bold leading-8 text-primary">
          Ticket Manager
        </h1>
        <p className="text-xs font-medium tracking-wider text-on-surface-variant opacity-70">
          Soporte Empresarial
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
            isActive("/dashboard")
              ? "scale-[0.98] border-l-4 border-primary bg-primary/10 text-primary"
              : "text-on-surface-variant hover:bg-surface-variant/50"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wider">
            Dashboard
          </span>
        </Link>
        <Link
          href="/tickets"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
            isActive("/tickets")
              ? "scale-[0.98] border-l-4 border-primary bg-primary/10 text-primary"
              : "text-on-surface-variant hover:bg-surface-variant/50"
          }`}
        >
          <Ticket className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wider">
            Tickets
          </span>
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-glass-stroke pt-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-variant/50"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold tracking-wider">
            Cerrar Sesion
          </span>
        </button>
      </div>
    </aside>
  );
}
