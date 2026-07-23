import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#05070C",
        color: "#F6F8FB",
        fontFamily: "'Manrope', sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8FD9FF", letterSpacing: "0.08em" }}>
        404
      </span>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 28, margin: 0 }}>
        This page doesn&apos;t exist.
      </h1>
      <Link href="/" style={{ color: "#3B6BFF", fontWeight: 600, textDecoration: "none" }}>
        Back to homepage
      </Link>
    </div>
  );
}
