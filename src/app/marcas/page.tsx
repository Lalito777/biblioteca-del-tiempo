import { supabase } from "@/lib/supabase";

type Marca = {
  id: string;
  nombre: string;
  pais: string | null;
  fundacion: number | null;
  historia: string | null;
  estado_actual: string | null;
};

export default async function MarcasPage() {
  const { data: marcas, error } = await supabase
    .from("marcas")
    .select("*")
    .order("nombre");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0", padding: "3rem 2rem" }}>
      <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
        ← Volver al inicio
      </a>

      <h1 style={{
        fontFamily: "Georgia, serif",
        fontSize: "2.5rem",
        margin: "1.5rem 0 0.5rem",
        color: "#E8E8F0",
      }}>
        Marcas
      </h1>
      <p style={{ color: "#A8A8B8", marginBottom: "3rem" }}>
        {marcas?.length ?? 0} marcas en la base de datos
      </p>

      {error && (
        <p style={{ color: "#E05050" }}>Error cargando datos: {error.message}</p>
      )}

      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "800px" }}>
        {marcas?.map((marca: Marca) => (
          <div
            key={marca.id}
            style={{
              border: "1px solid #1A1A2E",
              backgroundColor: "#0F0F1A",
              padding: "2rem",
            }}
          >
            <h2 style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              {marca.nombre}
            </h2>
            <p style={{ color: "#6A6A7A", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {marca.pais} · Fundada en {marca.fundacion}
            </p>
            <p style={{ color: "#A8A8B8", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              {marca.historia}
            </p>
            <p style={{ color: "#6A6A7A", fontSize: "0.85rem" }}>
              Estado: {marca.estado_actual}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
