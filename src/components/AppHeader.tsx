"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const baseLinks = [
  { href: "/dashboard", label: "Eventos" },
  { href: "/mis-inscripciones", label: "Mis inscripciones" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const isAdmin = profile?.role === "admin";
  const links = isAdmin
    ? [...baseLinks, { href: "/admin", label: "Admin" }]
    : baseLinks;

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <Link href="/dashboard" className="text-sm font-semibold text-teal-700">
            Gestor Académico
          </Link>
          <p className="text-xs text-slate-500">
            {profile?.full_name || "Usuario"} ·{" "}
            {isAdmin ? "Administrador" : "Usuario"}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
