"use client";

import { AppShell } from "@/components/AppShell";

export default function MisInscripcionesPage() {
  return (
    <AppShell>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-amber-700">
          Recordatorios
        </p>

        <h1 className="mt-3 text-3xl font-bold">Mis inscripciones</h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Esta sección mostrará los eventos en los que estás inscrito y servirá
          como recordatorio simple dentro de la aplicación.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="font-semibold text-slate-800">
          Todavía no hay inscripciones cargadas.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Cuando implementemos las inscripciones, tus eventos próximos
          aparecerán aquí.
        </p>
      </div>
    </AppShell>
  );
}
