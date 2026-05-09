import Link from "next/link";

const features = [
  {
    title: "Eventos centralizados",
    description: "Consulta conferencias, talleres, seminarios y cursos desde un solo lugar.",
  },
  {
    title: "Inscripciones simples",
    description: "Los usuarios podrán registrarse a eventos y cancelar su inscripción.",
  },
  {
    title: "Panel administrativo",
    description: "Los administradores podrán crear, editar y eliminar eventos académicos.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-sm font-semibold uppercase text-teal-700">
            Gestor Académico
          </p>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-amber-700">
            Ingeniería en proyectos de software
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
            Gestor de Eventos Académicos
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Aplicación web para organizar eventos académicos dentro de una
            institución educativa, permitiendo consultar actividades,
            administrar eventos e inscribirse de forma sencilla.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/registro"
              className="rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Alcance del MVP
          </p>

          <div className="mt-5 space-y-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <h2 className="font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
