"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          background: "#05070C",
          color: "#F6F8FB",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <span style={{ fontSize: 13, color: "#8FD9FF", letterSpacing: "0.08em" }}>APPLICATION ERROR</span>
        <h1 style={{ fontWeight: 600, fontSize: 26, margin: 0, maxWidth: 480 }}>
          Something broke on our end.
        </h1>
        <button
          onClick={reset}
          style={{
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 9,
            background: "#3B6BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
