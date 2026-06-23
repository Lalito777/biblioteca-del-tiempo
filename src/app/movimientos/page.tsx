import { supabase } from "@/lib/supabase";

type Movimiento = {
  id: string;
  nombre: string;
  anio: number | null;
  rubies: number | null;
  frecuencia: string | null;
  reserva_marcha: string | null;
  tipo: string | null;
  descripcion: string | null;
  marcas: { nombre: string } | null;
};

export default async function MovimientosPage() {
  const { data: movimientos, error } = await supabase
    .from("movimientos")
    .select("*, marcas(nombre)")
    .order("nombre");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0", padding: "3rem 2rem" }}>
      <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
        ← Volver al inicio
      </a>

      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", margin: "1.5rem 0 0.5rem" }}>
        Movimientos
      </h1>
      <p style={{ color: "#A8A8B8", marginBottom: "3rem" }}>
        {movimientos?.length ?? 0} calibres en la base de datos
      </p>

      {error && <p style={{ color: "#E05050" }}>Error cargando datos: {error.message}</p>}

      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "800px" }}>
        {movimientos?.map((m: Movimiento) => (
          <div key={m.id} style={{ border: "1px solid #1A1A2E", backgroundColor: "#0F0F1A", padding: "2rem" }}>
            <h2 style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              {m.nombre}
            </h2>
            <p style={{ color: "#6A6A7A", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {m.marcas?.nombre} · {m.anio} · {m.tipo}
            </p>
            <p style={{ color: "#A8A8B8", lineHeight: 1.6, marginBottom: "1rem" }}>
              {m.descripcion}
            </p>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "#6A6A7A" }}>
              <span>Rubíes: {m.rubies}</span>
              <span>Frecuencia: {m.frecuencia}</span>
              <span>Reserva: {m.reserva_marcha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
