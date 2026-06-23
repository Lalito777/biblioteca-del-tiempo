-- ============================================
-- USUARIOS Y MURO — Schema
-- ============================================

-- Tabla de perfiles públicos (vinculada a auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);

-- Trigger: crear perfil automáticamente cuando alguien se registra
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabla de publicaciones (el "muro")
create table publicaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  titulo text not null,
  descripcion text,
  marca text,
  imagen_url text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table profiles enable row level security;
alter table publicaciones enable row level security;

-- Perfiles: cualquiera puede leer, solo el dueño puede editar el suyo
create policy "Lectura pública de perfiles" on profiles for select using (true);
create policy "Usuarios editan su propio perfil" on profiles for update using (auth.uid() = id);

-- Publicaciones: cualquiera puede leer, solo usuarios autenticados pueden crear,
-- solo el dueño puede editar o borrar las suyas
create policy "Lectura pública de publicaciones" on publicaciones for select using (true);
create policy "Usuarios autenticados crean publicaciones" on publicaciones
  for insert with check (auth.uid() = user_id);
create policy "Usuarios editan sus propias publicaciones" on publicaciones
  for update using (auth.uid() = user_id);
create policy "Usuarios borran sus propias publicaciones" on publicaciones
  for delete using (auth.uid() = user_id);

-- ============================================
-- Storage: bucket para imágenes de relojes
-- ============================================
-- Nota: esto se configura desde el dashboard de Supabase (Storage > New bucket),
-- pero estas políticas se pueden pegar igual aquí una vez creado el bucket "relojes-fotos".

insert into storage.buckets (id, name, public)
values ('relojes-fotos', 'relojes-fotos', true)
on conflict (id) do nothing;

create policy "Lectura pública de fotos" on storage.objects
  for select using (bucket_id = 'relojes-fotos');

create policy "Usuarios autenticados suben fotos" on storage.objects
  for insert with check (bucket_id = 'relojes-fotos' and auth.uid() is not null);

create policy "Usuarios borran sus propias fotos" on storage.objects
  for delete using (bucket_id = 'relojes-fotos' and auth.uid() = owner);
