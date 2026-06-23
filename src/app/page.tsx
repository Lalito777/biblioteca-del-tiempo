'use client';

export default function Home() {
  const sections = [
    {
      title: "Marcas",
      description: "Historia, origen y evolución de las grandes manufactures: Omega, Patek Philippe, Rolex, Tissot y más.",
      icon: "⌚",
      href: "/marcas",
      count: "120+ marcas",
    },
    {
      title: "Movimientos",
      description: "Base de datos técnica de calibres: rubíes, frecuencia, reserva de marcha, fabricante y año.",
      icon: "⚙️",
      href: "/movimientos",
      count: "300+ calibres",
    },
    {
      title: "Correas",
      description: "Tipos, materiales e historia de las correas: cuero, metal, NATO, caucho y sus variantes vintage.",
      icon: "🔗",
      href: "/correas",
      count: "50+ tipos",
    },
    {
      title: "Glosario",
      description: "Términos técnicos explicados: escapamento, tourbillon, guilloché, complicaciones y más.",
      icon: "📖",
      href: "/glosario",
      count: "200+ términos",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0" }}>

      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid #1A1A2E",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "sticky",
        top: 0,
        backgroundColor: "#08080Fdd",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.4rem" }}>⌚</span>
          <span style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.1rem", letterSpacing: "0.15em", fontWeight: "bold" }}>
            RELOJERÍA WIKI
          </span>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Marcas", "Movimientos", "Correas", "Glosario", "Muro"].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              style={{
                color: "#A8A8B8",
                textDecoration: "none",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#A8A8B8")}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: "center",
        padding: "6rem 2rem 5rem",
        borderBottom: "1px solid #1A1A2E",
        background: "radial-gradient(ellipse at 50% 0%, #1A1A2E 0%, #08080F 70%)",
      }}>
        <p style={{
          color: "#C9A84C",
          letterSpacing: "0.3em",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}>
          La enciclopedia del reloj vintage
        </p>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          lineHeight: 1.15,
          marginBottom: "1.5rem",
          color: "#E8E8F0",
        }}>
          El tiempo tiene historia.<br />
          <span style={{ color: "#C9A84C" }}>Aquí la encontrarás.</span>
        </h1>
        <p style={{
          color: "#A8A8B8",
          fontSize: "1.05rem",
          maxWidth: "520px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.7,
        }}>
          Marcas, movimientos, referencias y glosario técnico. Todo lo que necesitas para entender y apreciar la relojería.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/marcas" style={{
            backgroundColor: "#C9A84C",
            color: "#08080F",
            padding: "0.8rem 2rem",
            textDecoration: "none",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}>
            Explorar Wiki
          </a>
          <a href="/glosario" style={{
            border: "1px solid #1A1A2E",
            color: "#A8A8B8",
            padding: "0.8rem 2rem",
            textDecoration: "none",
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Ver Glosario
          </a>
        </div>
      </section>

      {/* Sections grid */}
      <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          color: "#C9A84C",
          letterSpacing: "0.3em",
          fontSize: "0.7rem",
          textTransform: "uppercase",
          marginBottom: "3rem",
          textAlign: "center",
        }}>
          Explora por categoría
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1px",
          border: "1px solid #1A1A2E",
        }}>
          {sections.map((section) => (
            <a
              key={section.title}
              href={section.href}
              style={{
                display: "block",
                padding: "2.5rem 2rem",
                backgroundColor: "#0F0F1A",
                textDecoration: "none",
                borderRight: "1px solid #1A1A2E",
                transition: "background-color 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#141424")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0F0F1A")}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{section.icon}</div>
              <h2 style={{
                color: "#E8E8F0",
                fontSize: "1.2rem",
                fontFamily: "Georgia, serif",
                fontWeight: "normal",
                marginBottom: "0.75rem",
                letterSpacing: "0.05em",
              }}>
                {section.title}
              </h2>
              <p style={{
                color: "#6A6A7A",
                fontSize: "0.85rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}>
                {section.description}
              </p>
              <span style={{
                color: "#C9A84C",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}>
                {section.count} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1A1A2E",
        padding: "2rem",
        textAlign: "center",
        color: "#3A3A4A",
        fontSize: "0.8rem",
        letterSpacing: "0.1em",
      }}>
        RELOJERÍA WIKI — EN CONSTRUCCIÓN
      </footer>
    </div>
  );
}
