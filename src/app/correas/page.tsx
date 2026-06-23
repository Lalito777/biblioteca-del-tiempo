import { supabase } from "@/lib/supabase";

type Correa = {
  id: string;
  tipo: string;
  material: string | null;
  historia: string | null;
};

export default async function CorreasPage() {
  const { data: correas, error } = await supabase
    .from("correas")
    .select("*")
    .order("tipo");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0", padding: "3rem 2rem" }}>
      <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
        ← Volver al inicio
      </a>

      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", margin: "1.5rem 0 0.5rem" }}>
        Correas
      </h1>
      <p style={{ color: "#A8A8B8", marginBottom: "3rem" }}>
        {correas?.length ?? 0} tipos en la base de datos
      </p>

      {error && <p style={{ color: "#E05050" }}>Error cargando datos: {error.message}</p>}

      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "800px" }}>
        {correas?.map((c: Correa) => (
          <div key={c.id} style={{ border: "1px solid #1A1A2E", backgroundColor: "#0F0F1A", padding: "2rem" }}>
            <h2 style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              {c.tipo}
            </h2>
            <p style={{ color: "#6A6A7A", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Material: {c.material}
            </p>
            <p style={{ color: "#A8A8B8", lineHeight: 1.6 }}>{c.historia}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
