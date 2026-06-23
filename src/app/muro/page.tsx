import { createClient } from "@/lib/supabase/server";
import SubirPublicacion from "./SubirPublicacion";

type Publicacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  marca: string | null;
  imagen_url: string;
  created_at: string;
  profiles: { username: string } | null;
};

export default async function MuroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: publicaciones, error } = await supabase
    .from("publicaciones")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
            ← Volver al inicio
          </a>
          {user ? (
            <form action="/auth/signout" method="post">
              <button type="submit" style={{ background: "none", border: "1px solid #1A1A2E", color: "#A8A8B8", padding: "0.4rem 1rem", fontSize: "0.8rem", cursor: "pointer" }}>
                Cerrar sesión
              </button>
            </form>
          ) : (
            <a href="/login" style={{ color: "#C9A84C", fontSize: "0.85rem", textDecoration: "none" }}>
              Iniciar sesión →
            </a>
          )}
        </div>

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          El Muro
        </h1>
        <p style={{ color: "#A8A8B8", marginBottom: "2.5rem" }}>
          Comparte tus relojes con la comunidad
        </p>

        {user ? (
          <SubirPublicacion userId={user.id} />
        ) : (
          <div style={{ border: "1px solid #1A1A2E", backgroundColor: "#0F0F1A", padding: "1.5rem", marginBottom: "2.5rem", textAlign: "center" }}>
            <p style={{ color: "#A8A8B8", marginBottom: "1rem" }}>
              Inicia sesión para subir tus relojes al muro
            </p>
            <a href="/registro" style={{
              backgroundColor: "#C9A84C", color: "#08080F", padding: "0.6rem 1.5rem",
              textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              Crear cuenta
            </a>
          </div>
        )}

        {error && <p style={{ color: "#E05050" }}>Error cargando publicaciones: {error.message}</p>}

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {publicaciones?.length === 0 && (
            <p style={{ color: "#6A6A7A" }}>Aún no hay publicaciones. ¡Sé el primero!</p>
          )}
          {publicaciones?.map((p: Publicacion) => (
            <div key={p.id} style={{ border: "1px solid #1A1A2E", backgroundColor: "#0F0F1A" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imagen_url} alt={p.titulo} style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.2rem", marginBottom: "0.3rem" }}>
                  {p.titulo}
                </h2>
                <p style={{ color: "#6A6A7A", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                  Por @{p.profiles?.username ?? "usuario"} {p.marca && `· ${p.marca}`}
                </p>
                {p.descripcion && (
                  <p style={{ color: "#A8A8B8", lineHeight: 1.6 }}>{p.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
