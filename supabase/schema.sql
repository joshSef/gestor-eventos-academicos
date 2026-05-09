-- Gestor de Eventos Academicos
-- Ejecuta este archivo en el SQL Editor de Supabase.

create extension if not exists "pgcrypto";

-- Limpieza opcional para desarrollo.
-- Si ya tienes datos reales, no ejecutes estas lineas.
-- drop table if exists public.registrations;
-- drop table if exists public.events;
-- drop table if exists public.profiles;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date timestamptz not null,
  location text not null,
  category text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint registrations_user_event_unique unique (user_id, event_id)
);

create index if not exists events_event_date_idx on public.events(event_date);
create index if not exists registrations_user_id_idx on public.registrations(user_id);
create index if not exists registrations_event_id_idx on public.registrations(event_id);

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- Funcion auxiliar para validar administradores sin exponer todos los perfiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Crea automaticamente un perfil cuando alguien se registra con Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Evita que un usuario normal cambie su propio rol desde el cliente.
-- El SQL Editor de Supabase puede seguir usandose para marcar admins manualmente.
create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role <> new.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'No tienes permisos para cambiar el rol del perfil';
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists prevent_profile_role_escalation on public.profiles;

create trigger prevent_profile_role_escalation
before update on public.profiles
for each row execute function public.prevent_profile_role_escalation();

-- Politicas: profiles
drop policy if exists "Los usuarios pueden ver su propio perfil" on public.profiles;
create policy "Los usuarios pueden ver su propio perfil"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Los usuarios pueden actualizar su propio perfil" on public.profiles;
create policy "Los usuarios pueden actualizar su propio perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Politicas: events
drop policy if exists "Usuarios autenticados pueden ver eventos" on public.events;
create policy "Usuarios autenticados pueden ver eventos"
on public.events
for select
to authenticated
using (true);

drop policy if exists "Solo admins pueden crear eventos" on public.events;
create policy "Solo admins pueden crear eventos"
on public.events
for insert
to authenticated
with check (
  public.is_admin()
  and (created_by is null or created_by = auth.uid())
);

drop policy if exists "Solo admins pueden actualizar eventos" on public.events;
create policy "Solo admins pueden actualizar eventos"
on public.events
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Solo admins pueden eliminar eventos" on public.events;
create policy "Solo admins pueden eliminar eventos"
on public.events
for delete
to authenticated
using (public.is_admin());

-- Politicas: registrations
drop policy if exists "Usuarios pueden ver sus propias inscripciones" on public.registrations;
create policy "Usuarios pueden ver sus propias inscripciones"
on public.registrations
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Usuarios pueden inscribirse a eventos" on public.registrations;
create policy "Usuarios pueden inscribirse a eventos"
on public.registrations
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Usuarios pueden cancelar sus inscripciones" on public.registrations;
create policy "Usuarios pueden cancelar sus inscripciones"
on public.registrations
for delete
to authenticated
using (auth.uid() = user_id);

-- Datos de ejemplo opcionales.
-- Ejecutalos despues de crear un usuario admin y reemplaza el uuid si quieres asociarlos.
-- insert into public.events (title, description, event_date, location, category)
-- values
--   ('Conferencia de Innovacion Educativa', 'Charla sobre tecnologia aplicada a la educacion.', now() + interval '3 days', 'Auditorio principal', 'Conferencia'),
--   ('Taller de Git y GitHub', 'Sesion practica para aprender flujo basico con Git.', now() + interval '7 days', 'Laboratorio 2', 'Taller'),
--   ('Seminario de Investigacion', 'Presentacion de avances de proyectos academicos.', now() + interval '14 days', 'Sala de conferencias', 'Seminario');

-- Para convertir un usuario en administrador:
-- update public.profiles
-- set role = 'admin'
-- where id = 'uuid-del-usuario';
