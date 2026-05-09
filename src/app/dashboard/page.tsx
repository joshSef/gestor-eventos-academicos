"use client";

import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <AppShell>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-amber-700">
          Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-bold">Eventos académicos</h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Bienvenido, {profile?.full_name || user?.email}. Aquí se mostrará la
          lista de conferencias, talleres, seminarios y cursos disponibles.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Eventos</p>
            <p className="mt-2 text-2xl font-bold">Próximamente</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Mi rol</p>
            <p className="mt-2 text-2xl font-bold">
              {profile?.role === "admin" ? "Admin" : "Usuario"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Sesión</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">Activa</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="font-semibold text-slate-800">
          En el siguiente commit conectaremos esta vista con Supabase.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Después aparecerán aquí las tarjetas de eventos y el botón de
          inscripción.
        </p>
      </div>
    </AppShell>
  );
}
