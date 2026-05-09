# Gestor de Eventos Académicos

MVP web para gestionar eventos académicos dentro de una institución educativa.
Permite que estudiantes o docentes consulten eventos, se inscriban y revisen
recordatorios simples. También incluye un panel administrativo para crear,
editar y eliminar eventos.

Proyecto desarrollado para la materia Ingeniería en proyectos de software.

## Tecnologías

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase client desde el frontend

## Funcionalidades

- Registro de usuario con nombre, correo y contraseña.
- Inicio y cierre de sesión.
- Perfil básico con rol `user` o `admin`.
- Listado de eventos académicos disponibles.
- Panel admin para crear, editar y eliminar eventos.
- Inscripción y cancelación de inscripción a eventos.
- Prevención de inscripciones duplicadas.
- Vista de mis inscripciones con recordatorios próximos.

## Requisitos

- Node.js 20 o superior recomendado.
- npm.
- Proyecto creado en Supabase.

## Instalación local

```bash
npm install
```

Copia las variables de entorno:

```bash
cp .env.example .env.local
```

Completa `.env.local` con los valores de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Ejecuta el proyecto:

```bash
npm run dev
```

Luego abre:

```txt
http://localhost:3000
```

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Ve a Project Settings > API.
3. Copia `Project URL` en `NEXT_PUBLIC_SUPABASE_URL`.
4. Copia `anon public` en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Ve a SQL Editor.
6. Ejecuta el contenido de `supabase/schema.sql`.
7. En Authentication > Providers, habilita Email.
8. Para una demo rápida, puedes desactivar la confirmación de correo o confirmar usuarios manualmente.

## Usuario administrador

Primero registra un usuario desde la app. Después, en Supabase SQL Editor,
marca ese perfil como admin:

```sql
update public.profiles
set role = 'admin'
where id = 'uuid-del-usuario';
```

Puedes obtener el `id` en la tabla `profiles` o en Authentication > Users.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Validación manual

Hay un caso de validación completo en:

```txt
docs/caso-validacion.md
```
