"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Event, Registration } from "@/types/database";

export default function MisInscripcionesPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionEventId, setActionEventId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const eventIds = useMemo(
    () => new Set(registrations.map((registration) => registration.event_id)),
    [registrations]
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => new Date(event.event_date) >= now);
  }, [events]);

  const pastEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => new Date(event.event_date) < now);
  }, [events]);

  const loadRegistrations = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError("");

    const { data: registrationData, error: registrationError } = await supabase
      .from("registrations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (registrationError) {
      setRegistrations([]);
      setEvents([]);
      setError("No fue posible cargar tus inscripciones.");
      setIsLoading(false);
      return;
    }

    const nextRegistrations = registrationData ?? [];
    setRegistrations(nextRegistrations);

    if (nextRegistrations.length === 0) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    const ids = nextRegistrations.map((registration) => registration.event_id);
    const { data: eventData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("id", ids)
      .order("event_date", { ascending: true });

    if (eventsError) {
      setEvents([]);
      setError("No fue posible cargar los eventos inscritos.");
      setIsLoading(false);
      return;
    }

    setEvents(eventData ?? []);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadRegistrations();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRegistrations, user]);

  async function handleCancelRegistration(eventId: string) {
    if (!user || !eventIds.has(eventId)) {
      return;
    }

    setActionEventId(eventId);
    setError("");
    setSuccessMessage("");

    const { error: deleteError } = await supabase
      .from("registrations")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    setActionEventId(null);

    if (deleteError) {
      setError("No fue posible cancelar la inscripción.");
      await loadRegistrations();
      return;
    }

    setRegistrations((currentRegistrations) =>
      currentRegistrations.filter(
        (registration) => registration.event_id !== eventId
      )
    );
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );
    setSuccessMessage("Inscripción cancelada correctamente.");
  }

  return (
    <AppShell>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-amber-700">
          Recordatorios
        </p>

        <h1 className="mt-3 text-3xl font-bold">Mis inscripciones</h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Consulta los eventos en los que estás inscrito. Los próximos funcionan
          como recordatorios simples dentro de la aplicación.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">
              Inscripciones
            </p>
            <p className="mt-2 text-2xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">
              Próximos recordatorios
            </p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {upcomingEvents.length}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Finalizados</p>
            <p className="mt-2 text-2xl font-bold">{pastEvents.length}</p>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Recordatorios próximos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Eventos inscritos que todavía no han ocurrido.
            </p>
          </div>

          <button
            type="button"
            onClick={loadRegistrations}
            disabled={isLoading}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {isLoading ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-800">
            {successMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-600">
            Cargando inscripciones...
          </div>
        ) : null}

        {!isLoading && events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="font-semibold text-slate-800">
              Todavía no tienes inscripciones.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Explora los eventos disponibles e inscríbete a alguno para verlo
              aquí.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Ver eventos
            </Link>
          </div>
        ) : null}

        {!isLoading && upcomingEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered
                isActionLoading={actionEventId === event.id}
                onRegister={() => undefined}
                onCancelRegistration={handleCancelRegistration}
              />
            ))}
          </div>
        ) : null}
      </section>

      {!isLoading && pastEvents.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Eventos finalizados</h2>
          <p className="mt-1 text-sm text-slate-600">
            Historial básico de eventos en los que estuviste inscrito.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered
                isActionLoading={actionEventId === event.id}
                onRegister={() => undefined}
                onCancelRegistration={handleCancelRegistration}
              />
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
