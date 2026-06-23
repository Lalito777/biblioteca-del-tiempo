"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_MB = 5;
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

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

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
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

    const ext = archivo.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("relojes-fotos")
      .upload(path, archivo);

    if (uploadError) {
      setError("Error subiendo la imagen: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("relojes-fotos").getPublicUrl(path);

    const { error: insertError } = await supabase.from("publicaciones").insert({
      user_id: userId,
      titulo,
      marca,
      descripcion,
      imagen_url: urlData.publicUrl,
    });

    setLoading(false);

    if (insertError) {
      setError("Error guardando la publicación: " + insertError.message);
      return;
    }

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
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Cuéntanos sobre tu reloj..."
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
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
