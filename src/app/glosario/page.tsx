const terminos = [
  { termino: "Escape", definicion: "Mecanismo que regula la liberación de energía del resorte hacia el sistema de oscilación, permitiendo el avance del reloj a intervalos regulares." },
  { termino: "Tourbillon", definicion: "Complicación que monta el escape y el volante en una jaula giratoria, diseñada para contrarrestar los efectos de la gravedad en la precisión." },
  { termino: "Guilloché", definicion: "Técnica decorativa de grabado mecánico que crea patrones geométricos repetitivos en la esfera o caja del reloj." },
  { termino: "Reserva de marcha", definicion: "Tiempo que un reloj mecánico sigue funcionando después de haber sido completamente cuerda, sin recibir más energía." },
  { termino: "Complicación", definicion: "Cualquier función de un reloj mecánico además de mostrar la hora y los minutos, como el calendario, cronógrafo o fases lunares." },
  { termino: "Rubíes", definicion: "Piedras sintéticas usadas como cojinetes en los puntos de fricción del movimiento para reducir el desgaste y mejorar la precisión." },
  { termino: "Cronógrafo", definicion: "Complicación que permite medir intervalos de tiempo de forma independiente a la hora principal, usando botones pulsadores." },
  { termino: "Frecuencia", definicion: "Velocidad de oscilación del volante, medida en alternancias por hora (vph) o hercios (Hz); determina la precisión del reloj." },
  { termino: "COSC", definicion: "Control Oficial Suizo de Cronómetros, organismo independiente que certifica la precisión de los movimientos suizos." },
  { termino: "Hermeticidad", definicion: "Resistencia de un reloj al ingreso de agua y polvo, medida en metros o ATM (atmósferas)." },
];

export default function GlosarioPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080F", color: "#E8E8F0", padding: "3rem 2rem" }}>
      <a href="/" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem" }}>
        ← Volver al inicio
      </a>

      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", margin: "1.5rem 0 0.5rem" }}>
        Glosario
      </h1>
      <p style={{ color: "#A8A8B8", marginBottom: "3rem" }}>
        {terminos.length} términos técnicos explicados
      </p>

      <div style={{ display: "grid", gap: "1.25rem", maxWidth: "800px" }}>
        {terminos.map((t) => (
          <div key={t.termino} style={{ borderBottom: "1px solid #1A1A2E", paddingBottom: "1.25rem" }}>
            <h2 style={{ color: "#C9A84C", fontFamily: "Georgia, serif", fontSize: "1.15rem", marginBottom: "0.4rem" }}>
              {t.termino}
            </h2>
            <p style={{ color: "#A8A8B8", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {t.definicion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
