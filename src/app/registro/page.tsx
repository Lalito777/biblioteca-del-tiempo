"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");

    const user = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(user)) {
      setError("El nombre de usuario debe tener entre 3 y 20 caracteres, solo letras, números y guion bajo.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: user } },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("unique")) {
        setError("Ese nombre de usuario ya está en uso. Elige otro.");
      } else if (error.message.toLowerCase().includes("already registered")) {
        setError("Ese correo ya tiene una cuenta. Intenta iniciar sesión.");
      } else {
        setError(error.message);
      }
      return;
    }

    // Si Supabase tiene activada la confirmación por correo, no hay
    // sesión todavía: mandarlo al muro lo dejaría sin entender por qué
    // no puede publicar.
    if (!data.session) {
      setAviso(
        "Cuenta creada. Te enviamos un correo de confirmación: ábrelo para activar tu cuenta y luego inicia sesión."
      );
      return;
    }

    router.push("/muro");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#08080F",
      color: "#E8E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Volver al inicio
        </a>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", margin: "1.5rem 0 2rem" }}>
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nombre de usuario (a-z, 0-9, _)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && <p style={{ color: "#E05050", fontSize: "0.85rem" }}>{error}</p>}
          {aviso && <p style={{ color: "#C9A84C", fontSize: "0.85rem", lineHeight: 1.5 }}>{aviso}</p>}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ color: "#6A6A7A", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#C9A84C" }}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "#0F0F1A",
  border: "1px solid #1A1A2E",
  color: "#E8E8F0",
  padding: "0.75rem 1rem",
  fontSize: "0.95rem",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#C9A84C",
  color: "#08080F",
  border: "none",
  padding: "0.85rem",
  fontSize: "0.85rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "0.5rem",
};
