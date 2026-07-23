"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        background: "#05070C",
        color: "#F6F8FB",
        fontFamily: "'Manrope', sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8FD9FF", letterSpacing: "0.08em" }}>
        SOMETHING WENT WRONG
      </span>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 26, margin: 0, maxWidth: 480 }}>
        This page hit an unexpected error.
      </h1>
      <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 9,
            background: "#3B6BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 9,
            border: "1px solid rgba(245,247,250,0.16)",
            color: "#F6F8FB",
            textDecoration: "none",
          }}
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
