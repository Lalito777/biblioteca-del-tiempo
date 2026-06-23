-- ============================================
-- RELOJERÍA WIKI — Schema inicial
-- ============================================

-- Tabla: marcas
create table marcas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  pais text,
  fundacion int,
  historia text,
  estado_actual text,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- Tabla: movimientos (calibres)
create table movimientos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fabricante_id uuid references marcas(id),
  anio int,
  rubies int,
  frecuencia text, -- ej: "28800 vph"
  reserva_marcha text, -- ej: "42 horas"
  tipo text, -- automático / cuarzo / manual
  descripcion text,
  created_at timestamp with time zone default now()
);

-- Tabla: referencias (modelos específicos de reloj)
create table referencias (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid references marcas(id),
  modelo text not null,
  anio int,
  movimiento_id uuid references movimientos(id),
  descripcion text,
  fotos text[], -- array de URLs
  created_at timestamp with time zone default now()
);

-- Tabla: correas
create table correas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  material text,
  historia text,
  imagenes text[],
  created_at timestamp with time zone default now()
);

-- ============================================
-- Datos de prueba
-- ============================================

insert into marcas (nombre, pais, fundacion, historia, estado_actual) values
('Omega', 'Suiza', 1848, 'Fundada por Louis Brandt, reconocida por el Speedmaster usado en la llegada a la Luna.', 'Activa, parte del grupo Swatch'),
('Rolex', 'Suiza', 1905, 'Fundada por Hans Wilsdorf, pionera en relojes impermeables y cronómetros certificados.', 'Activa, independiente'),
('Tissot', 'Suiza', 1853, 'Una de las marcas suizas más antiguas, conocida por relojes accesibles de alta calidad.', 'Activa, parte del grupo Swatch');

insert into movimientos (nombre, fabricante_id, anio, rubies, frecuencia, reserva_marcha, tipo, descripcion)
select 'Calibre 861', id, 1968, 17, '21600 vph', '48 horas', 'manual', 'Movimiento cronógrafo manual usado en el Speedmaster Professional.'
from marcas where nombre = 'Omega';

insert into movimientos (nombre, fabricante_id, anio, rubies, frecuencia, reserva_marcha, tipo, descripcion)
select 'Calibre 3235', id, 2015, 31, '28800 vph', '70 horas', 'automático', 'Movimiento automático con escape Chronergy, usado en Submariner y otros.'
from marcas where nombre = 'Rolex';

-- Habilitar lectura pública (para que la web pueda leer sin login)
alter table marcas enable row level security;
alter table movimientos enable row level security;
alter table referencias enable row level security;
alter table correas enable row level security;

create policy "Lectura pública marcas" on marcas for select using (true);
create policy "Lectura pública movimientos" on movimientos for select using (true);
create policy "Lectura pública referencias" on referencias for select using (true);
create policy "Lectura pública correas" on correas for select using (true);
