"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-700">
        <p className="text-sm font-medium">Cargando sesión...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/dashboard" className="text-sm font-semibold text-teal-700">
            Gestor Académico
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-amber-700">
            Sesión activa
          </p>

          <h1 className="mt-3 text-3xl font-bold">Dashboard de eventos</h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Bienvenido, {profile?.full_name || user.email}. En el siguiente
            commit conectaremos esta pantalla con los eventos académicos del
            sistema.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Correo</p>
              <p className="mt-2 break-words font-semibold">{user.email}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Rol</p>
              <p className="mt-2 font-semibold">
                {profile?.role === "admin" ? "Administrador" : "Usuario"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Estado</p>
              <p className="mt-2 font-semibold text-teal-700">Autenticado</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
