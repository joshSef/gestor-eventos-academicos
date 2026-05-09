"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/types/database";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => new Date(event.event_date) >= now).length;
  }, [events]);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setError("");

    const { data, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (eventsError) {
      setEvents([]);
      setError("No fue posible cargar los eventos. Intenta nuevamente.");
      setIsLoadingEvents(false);
      return;
    }

    setEvents(data ?? []);
    setIsLoadingEvents(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEvents();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEvents]);

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
            <p className="text-sm font-medium text-slate-500">
              Eventos publicados
            </p>
            <p className="mt-2 text-2xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Próximos</p>
            <p className="mt-2 text-2xl font-bold">{upcomingEvents}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Mi rol</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {profile?.role === "admin" ? "Admin" : "Usuario"}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Eventos disponibles</h2>
            <p className="mt-1 text-sm text-slate-600">
              Consulta las actividades académicas registradas en el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={loadEvents}
            disabled={isLoadingEvents}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {isLoadingEvents ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {isLoadingEvents ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-600">
            Cargando eventos...
          </div>
        ) : null}

        {!isLoadingEvents && !error && events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="font-semibold text-slate-800">
              Todavía no hay eventos publicados.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {profile?.role === "admin"
                ? "Puedes crear el primer evento desde el panel de administración."
                : "Cuando el administrador publique eventos, aparecerán aquí."}
            </p>
            {profile?.role === "admin" ? (
              <Link
                href="/admin"
                className="mt-4 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Ir al panel admin
              </Link>
            ) : null}
          </div>
        ) : null}

        {!isLoadingEvents && !error && events.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
