"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedPage } from "@/components/ProtectedPage";

type AppShellProps = {
  children: ReactNode;
  adminOnly?: boolean;
};

export function AppShell({ children, adminOnly = false }: AppShellProps) {
  return (
    <ProtectedPage adminOnly={adminOnly}>
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <AppHeader />
        <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>
      </main>
    </ProtectedPage>
  );
}
