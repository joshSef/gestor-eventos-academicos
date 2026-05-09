"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Event, Registration } from "@/types/database";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [actionEventId, setActionEventId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => new Date(event.event_date) >= now).length;
  }, [events]);

  const registeredEventIds = useMemo(
    () => new Set(registrations.map((registration) => registration.event_id)),
    [registrations]
  );

  const loadDashboardData = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoadingEvents(true);
    setError("");

    const [eventsResponse, registrationsResponse] = await Promise.all([
      supabase.from("events").select("*").order("event_date", {
        ascending: true,
      }),
      supabase
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (eventsResponse.error) {
      setEvents([]);
      setRegistrations([]);
      setError("No fue posible cargar los eventos. Intenta nuevamente.");
      setIsLoadingEvents(false);
      return;
    }

    if (registrationsResponse.error) {
      setEvents(eventsResponse.data ?? []);
      setRegistrations([]);
      setError("No fue posible cargar tus inscripciones.");
      setIsLoadingEvents(false);
      return;
    }

    setEvents(eventsResponse.data ?? []);
    setRegistrations(registrationsResponse.data ?? []);
    setIsLoadingEvents(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadDashboardData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboardData, user]);

  async function handleRegister(eventId: string) {
    if (!user || registeredEventIds.has(eventId)) {
      return;
    }

    setActionEventId(eventId);
    setError("");
    setSuccessMessage("");

    const { data, error: registrationError } = await supabase
      .from("registrations")
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select("*")
      .single();

    setActionEventId(null);

    if (registrationError) {
      setError(
        registrationError.code === "23505"
          ? "Ya estás inscrito a este evento."
          : "No fue posible completar la inscripción."
      );
      await loadDashboardData();
      return;
    }

    if (data) {
      setRegistrations((currentRegistrations) => [
        data,
        ...currentRegistrations,
      ]);
    }

    setSuccessMessage("Inscripción realizada correctamente.");
  }

  async function handleCancelRegistration(eventId: string) {
    if (!user || !registeredEventIds.has(eventId)) {
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
      await loadDashboardData();
      return;
    }

    setRegistrations((currentRegistrations) =>
      currentRegistrations.filter(
        (registration) => registration.event_id !== eventId
      )
    );
    setSuccessMessage("Inscripción cancelada correctamente.");
  }

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
            <p className="text-sm font-medium text-slate-500">
              Mis inscripciones
            </p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {registeredEventIds.size}
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
            onClick={loadDashboardData}
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

        {successMessage ? (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-800">
            {successMessage}
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
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEventIds.has(event.id)}
                isActionLoading={actionEventId === event.id}
                onRegister={handleRegister}
                onCancelRegistration={handleCancelRegistration}
              />
            ))}
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
