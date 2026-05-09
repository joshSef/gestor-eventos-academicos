"use client";

import { AppShell } from "@/components/AppShell";

export default function AdminPage() {
  return (
    <AppShell adminOnly>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-amber-700">
          Administración
        </p>

        <h1 className="mt-3 text-3xl font-bold">Panel de eventos</h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Esta sección estará disponible para administradores. Aquí se podrán
          crear, editar y eliminar eventos académicos.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <h2 className="text-lg font-semibold">Formulario de evento</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            En el commit de administración agregaremos los campos de título,
            descripción, fecha, ubicación y categoría.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <h2 className="text-lg font-semibold">Eventos creados</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Aquí aparecerá la lista administrativa con acciones para editar o
            eliminar eventos.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
