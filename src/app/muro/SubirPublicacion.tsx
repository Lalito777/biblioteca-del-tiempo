"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_MB = 5;
const MAX_TITULO = 120;
const MAX_MARCA = 60;
const MAX_DESCRIPCION = 2000;

// La extensión se deduce del tipo real del archivo, nunca de su nombre:
// un nombre como "foto.jpg.html" no debe terminar guardado como .html.
const TIPOS_PERMITIDOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function SubirPublicacion({ userId }: { userId: string }) {
  const [titulo, setTitulo] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!TIPOS_PERMITIDOS[file.type]) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP.");
      setArchivo(null);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede pesar más de ${MAX_SIZE_MB}MB.`);
      setArchivo(null);
      return;
    }

    setError("");
    setArchivo(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!archivo) {
      setError("Selecciona una imagen.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = createClient();

    const ext = TIPOS_PERMITIDOS[archivo.type];
    if (!ext) {
      setError("Tipo de archivo no permitido.");
      setLoading(false);
      return;
    }

    // La carpeta debe ser el id del usuario: así lo exige la política
    // de Storage, que impide escribir en la carpeta de otra persona.
    const path = `${userId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("relojes-fotos")
      .upload(path, archivo, { contentType: archivo.type, upsert: false });

    if (uploadError) {
      setError("Error subiendo la imagen: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("relojes-fotos").getPublicUrl(path);

    const { error: insertError } = await supabase.from("publicaciones").insert({
      user_id: userId,
      titulo: titulo.trim(),
      marca: marca.trim() || null,
      descripcion: descripcion.trim() || null,
      imagen_url: urlData.publicUrl,
    });

    if (insertError) {
      // La foto ya se subió pero la publicación falló: borramos la
      // imagen para no dejar archivos huérfanos ocupando espacio.
      await supabase.storage.from("relojes-fotos").remove([path]);
      setLoading(false);
      setError(
        insertError.message.includes("row-level security")
          ? "Has publicado demasiado en poco tiempo. Espera un rato e intenta de nuevo."
          : "Error guardando la publicación: " + insertError.message
      );
      return;
    }

    setLoading(false);

    setTitulo("");
    setMarca("");
    setDescripcion("");
    setArchivo(null);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #1A1A2E",
        backgroundColor: "#0F0F1A",
        padding: "1.5rem",
        marginBottom: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      <p style={{ color: "#C9A84C", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Sube tu reloj
      </p>

      <input
        type="text"
        placeholder="Título (ej: Mi Omega Speedmaster del 78)"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        maxLength={MAX_TITULO}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
        maxLength={MAX_MARCA}
        style={inputStyle}
      />
      <textarea
        placeholder="Cuéntanos sobre tu reloj..."
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
        maxLength={MAX_DESCRIPCION}
        style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }}
      />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        required
        style={{ color: "#A8A8B8", fontSize: "0.85rem" }}
      />

      {error && <p style={{ color: "#E05050", fontSize: "0.85rem" }}>{error}</p>}

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Subiendo..." : "Publicar"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "#08080F",
  border: "1px solid #1A1A2E",
  color: "#E8E8F0",
  padding: "0.65rem 0.85rem",
  fontSize: "0.9rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#C9A84C",
  color: "#08080F",
  border: "none",
  padding: "0.75rem",
  fontSize: "0.8rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: "bold",
  cursor: "pointer",
};
