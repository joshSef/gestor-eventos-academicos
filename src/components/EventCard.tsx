"use client";

import type { Event } from "@/types/database";

type EventCardProps = {
  event: Event;
};

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

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
          {event.category}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {formatEventDate(event.event_date)}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-slate-950">{event.title}</h2>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {event.description}
      </p>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm font-medium text-slate-500">Ubicación</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {event.location}
        </p>
      </div>
    </article>
  );
}
