"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada (o desactiva la confirmación en Supabase mientras desarrollas).");
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError(error.message);
      }
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
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && <p style={{ color: "#E05050", fontSize: "0.85rem" }}>{error}</p>}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ color: "#6A6A7A", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>
          ¿No tienes cuenta?{" "}
          <a href="/registro" style={{ color: "#C9A84C" }}>Regístrate</a>
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
