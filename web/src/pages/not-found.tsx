// src/pages/not-found.tsx
export function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "0 2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "24px", color: "#333", marginBottom: "1rem" }}>
        Link não encontrado
      </h1>

      <p style={{ color: "#666", lineHeight: "1.6", maxWidth: "400px" }}>
        O link que você está tentando acessar não existe, foi removido ou é uma
        URL inválida. Saiba mais em{" "}
        <a href="/" style={{ color: "#2563eb", fontWeight: "bold" }}>
          brev.ly
        </a>
        .
      </p>

      <a
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "semibold",
        }}
      >
        Voltar para a Home
      </a>
    </div>
  );
}
