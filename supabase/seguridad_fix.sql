-- ============================================================
-- ENDURECIMIENTO DE SEGURIDAD — 25/07/2026
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- Es seguro ejecutarlo más de una vez.
-- ============================================================
--
-- ANTES DE EJECUTAR: borra las cuentas de prueba en
-- Authentication → Users, para que las nuevas reglas de
-- username no choquen con datos viejos.
-- ============================================================


-- ------------------------------------------------------------
-- 1. BUCKET: límite de tamaño y tipos permitidos EN EL SERVIDOR
-- ------------------------------------------------------------
-- Problema: hoy los 5MB y "solo imágenes" se validan únicamente
-- en el navegador. Cualquiera puede saltarse eso y subir un
-- archivo de 500MB o un .html con JavaScript malicioso.
-- Esto lo bloquea del lado del servidor.

update storage.buckets
set
  file_size_limit  = 5242880,  -- 5 MB en bytes
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'relojes-fotos';


-- ------------------------------------------------------------
-- 2. STORAGE: cada usuario solo puede escribir en SU carpeta
-- ------------------------------------------------------------
-- Problema: la política vieja decía "cualquier usuario logueado
-- puede subir a este bucket". Eso permite subir dentro de la
-- carpeta de otro usuario (ej: 'uuid-de-otro/foto.jpg').
-- La ruta que usa la app es `${userId}/${timestamp}.jpg`,
-- así que exigimos que la primera carpeta sea su propio id.

drop policy if exists "Usuarios autenticados suben fotos" on storage.objects;
drop policy if exists "Usuarios suben fotos a su propia carpeta" on storage.objects;

create policy "Usuarios suben fotos a su propia carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'relojes-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Borrado: mismo criterio (antes usaba `owner`, que está deprecado)
drop policy if exists "Usuarios borran sus propias fotos" on storage.objects;

create policy "Usuarios borran sus propias fotos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'relojes-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Nadie puede sobrescribir archivos ajenos (no creamos policy de UPDATE)


-- ------------------------------------------------------------
-- 3. PUBLICACIONES: límites de largo en los textos
-- ------------------------------------------------------------
-- Problema: hoy nada impide insertar un título de 10 MB de texto
-- y llenar la base de datos.

alter table publicaciones drop constraint if exists titulo_largo;
alter table publicaciones add constraint titulo_largo
  check (char_length(titulo) between 1 and 120) not valid;

alter table publicaciones drop constraint if exists descripcion_largo;
alter table publicaciones add constraint descripcion_largo
  check (descripcion is null or char_length(descripcion) <= 2000) not valid;

alter table publicaciones drop constraint if exists marca_largo;
alter table publicaciones add constraint marca_largo
  check (marca is null or char_length(marca) <= 60) not valid;


-- ------------------------------------------------------------
-- 4. PUBLICACIONES: la foto debe estar en NUESTRO bucket
-- ------------------------------------------------------------
-- Problema: `imagen_url` es texto libre que manda el navegador.
-- Alguien podía publicar apuntando a una imagen de otro sitio
-- (hotlinking, contenido que no controlamos, tracking pixels).

alter table publicaciones drop constraint if exists imagen_url_propia;
alter table publicaciones add constraint imagen_url_propia
  check (
    imagen_url like 'https://%.supabase.co/storage/v1/object/public/relojes-fotos/%'
  ) not valid;


-- ------------------------------------------------------------
-- 5. PUBLICACIONES: freno anti-spam (máx. 10 por hora)
-- ------------------------------------------------------------
-- Problema: un usuario podía inundar el muro con un script.

drop policy if exists "Usuarios autenticados crean publicaciones" on publicaciones;

create policy "Usuarios autenticados crean publicaciones" on publicaciones
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and (
      select count(*) from publicaciones p
      where p.user_id = auth.uid()
        and p.created_at > now() - interval '1 hour'
    ) < 10
  );


-- ------------------------------------------------------------
-- 6. PERFILES: formato de username
-- ------------------------------------------------------------
-- Problema: hoy el username puede ser cualquier cosa —
-- espacios, emojis, 5000 caracteres, o suplantación tipo
-- "Omega Oficial ✓". Lo limitamos a a-z, 0-9 y guion bajo.

alter table profiles drop constraint if exists username_formato;
alter table profiles add constraint username_formato
  check (username ~ '^[a-z0-9_]{3,20}$') not valid;

alter table profiles drop constraint if exists bio_largo;
alter table profiles add constraint bio_largo
  check (bio is null or char_length(bio) <= 500) not valid;

-- El username no se puede cambiar una vez creado (evita
-- que alguien construya reputación y luego se haga pasar por otro)
create or replace function public.bloquear_cambio_username()
returns trigger
language plpgsql
as $$
begin
  if new.username is distinct from old.username then
    raise exception 'El nombre de usuario no se puede cambiar';
  end if;
  return new;
end;
$$;

drop trigger if exists no_cambiar_username on profiles;
create trigger no_cambiar_username
  before update on profiles
  for each row execute procedure public.bloquear_cambio_username();


-- ------------------------------------------------------------
-- 7. TRIGGER DE REGISTRO: robusto ante nombres repetidos
-- ------------------------------------------------------------
-- Problema: si dos personas elegían el mismo username, el
-- trigger reventaba y el registro fallaba con un error críptico
-- ("Database error saving new user"). Ahora limpia el nombre,
-- lo ajusta al formato y le agrega un número si ya existe.
--
-- Además agregamos `set search_path = public`: sin eso, una
-- función `security definer` puede ser engañada para ejecutar
-- código de otro esquema.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base      text;
  candidato text;
  n         int := 0;
begin
  base := lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  base := regexp_replace(base, '[^a-z0-9_]', '', 'g');
  base := left(base, 20);

  if char_length(base) < 3 then
    base := 'usuario' || left(replace(new.id::text, '-', ''), 6);
  end if;

  candidato := base;
  while exists (select 1 from public.profiles where username = candidato) loop
    n := n + 1;
    candidato := left(base, 20 - char_length(n::text)) || n::text;
  end loop;

  insert into public.profiles (id, username) values (new.id, candidato);
  return new;
end;
$$;


-- ------------------------------------------------------------
-- 8. Índice para que el muro siga rápido cuando crezca
-- ------------------------------------------------------------
create index if not exists publicaciones_created_at_idx
  on publicaciones (created_at desc);

create index if not exists publicaciones_user_id_idx
  on publicaciones (user_id);


-- ============================================================
-- COMPROBACIÓN — ejecuta esto después para ver que quedó bien
-- ============================================================
-- select id, file_size_limit, allowed_mime_types from storage.buckets where id = 'relojes-fotos';
-- select policyname, cmd from pg_policies where tablename in ('publicaciones','profiles','objects');
