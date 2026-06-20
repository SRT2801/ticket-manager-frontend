"use client";

import { useAuth } from "@/lib/auth";
import { Bell, Settings } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-glass-stroke bg-glass-fill/70 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-l border-glass-stroke pl-4">
          <div className="text-right">
            <p className="text-sm font-semibold tracking-wider text-on-surface">
              {user?.name || "Usuario"}
            </p>
            <p className="text-xs font-medium tracking-wider text-on-surface-variant">
              {user?.role === "admin" ? "Admin" : "Usuario"}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-primary-container text-sm font-bold text-on-primary-container">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
