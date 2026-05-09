"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

type ProtectedPageProps = {
  children: ReactNode;
  adminOnly?: boolean;
};

export function ProtectedPage({
  children,
  adminOnly = false,
}: ProtectedPageProps) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (adminOnly && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [adminOnly, isAdmin, loading, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700">
        <p className="text-sm font-medium">Cargando sesión...</p>
      </main>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700">
        <p className="text-sm font-medium">Redirigiendo al dashboard...</p>
      </main>
    );
  }

  return children;
}
