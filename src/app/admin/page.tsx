"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Event } from "@/types/database";

const categories = ["Conferencia", "Taller", "Seminario", "Curso", "Otro"];

type EventFormState = {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  category: string;
};

function toDateTimeLocalValue(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function createInitialForm(): EventFormState {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  return {
    title: "",
    description: "",
    eventDate: toDateTimeLocalValue(tomorrow),
    location: "",
    category: "Conferencia",
  };
}

function formFromEvent(event: Event): EventFormState {
  return {
    title: event.title,
    description: event.description,
    eventDate: toDateTimeLocalValue(new Date(event.event_date)),
    location: event.location,
    category: event.category,
  };
}

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha por confirmar";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<EventFormState>(() => createInitialForm());
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formTitle = editingEvent ? "Editar evento" : "Crear evento";
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ),
    [events]
  );

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const { data, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (eventsError) {
      setEvents([]);
      setError("No fue posible cargar los eventos.");
      setIsLoading(false);
      return;
    }

    setEvents(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadEvents();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEvents]);

  function updateFormField(field: keyof EventFormState, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(createInitialForm());
    setEditingEvent(null);
    setError("");
  }

  function validateForm() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.eventDate.trim() ||
      !form.location.trim() ||
      !form.category.trim()
    ) {
      return "Completa todos los campos del evento.";
    }

    if (Number.isNaN(new Date(form.eventDate).getTime())) {
      return "Selecciona una fecha válida.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      event_date: new Date(form.eventDate).toISOString(),
      location: form.location.trim(),
      category: form.category.trim(),
    };

    if (editingEvent) {
      const { error: updateError } = await supabase
        .from("events")
        .update(payload)
        .eq("id", editingEvent.id);

      setIsSaving(false);

      if (updateError) {
        setError("No fue posible actualizar el evento.");
        return;
      }

      setSuccessMessage("Evento actualizado correctamente.");
    } else {
      const { error: insertError } = await supabase.from("events").insert({
        ...payload,
        created_by: user?.id ?? null,
      });

      setIsSaving(false);

      if (insertError) {
        setError("No fue posible crear el evento. Verifica tu rol admin.");
        return;
      }

      setSuccessMessage("Evento creado correctamente.");
    }

    resetForm();
    await loadEvents();
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    setForm(formFromEvent(event));
    setError("");
    setSuccessMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(event: Event) {
    const confirmed = window.confirm(
      `¿Eliminar el evento "${event.title}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingEventId(event.id);
    setError("");
    setSuccessMessage("");

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    setDeletingEventId(null);

    if (deleteError) {
      setError("No fue posible eliminar el evento.");
      return;
    }

    if (editingEvent?.id === event.id) {
      resetForm();
    }

    setSuccessMessage("Evento eliminado correctamente.");
    await loadEvents();
  }

  return (
    <AppShell adminOnly>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-amber-700">
          Administración
        </p>

        <h1 className="mt-3 text-3xl font-bold">Panel de eventos</h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Crea, edita y elimina los eventos académicos que aparecerán en el
          dashboard de usuarios.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{formTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">
                Captura la información básica del evento académico.
              </p>
            </div>

            {editingEvent ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
            ) : null}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-700"
              >
                Título
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(event) => updateFormField("title", event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Ej. Taller de Git y GitHub"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Descripción
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateFormField("description", event.target.value)
                }
                className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Describe brevemente el objetivo del evento"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="eventDate"
                  className="text-sm font-medium text-slate-700"
                >
                  Fecha y hora
                </label>
                <input
                  id="eventDate"
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(event) =>
                    updateFormField("eventDate", event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-slate-700"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    updateFormField("category", event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-slate-700"
              >
                Ubicación
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(event) =>
                  updateFormField("location", event.target.value)
                }
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                placeholder="Ej. Auditorio principal"
              />
            </div>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                {successMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving
                ? "Guardando..."
                : editingEvent
                  ? "Guardar cambios"
                  : "Crear evento"}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Eventos creados</h2>
              <p className="mt-1 text-sm text-slate-600">
                {events.length} evento{events.length === 1 ? "" : "s"} en el
                sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={loadEvents}
              disabled={isLoading}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isLoading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-center text-sm font-medium text-slate-600">
              Cargando eventos...
            </div>
          ) : null}

          {!isLoading && sortedEvents.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="font-semibold text-slate-800">
                Todavía no hay eventos.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Crea el primer evento para que aparezca en el dashboard.
              </p>
            </div>
          ) : null}

          {!isLoading && sortedEvents.length > 0 ? (
            <div className="mt-6 space-y-3">
              {sortedEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                          {event.category}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {formatEventDate(event.event_date)}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-slate-950">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {event.description}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        {event.location}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(event)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        disabled={deletingEventId === event.id}
                        className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                      >
                        {deletingEventId === event.id ? "Eliminando" : "Eliminar"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
