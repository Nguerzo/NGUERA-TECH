"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const [ready, setReady] = useState<"pending" | "webgl" | "static">("pending");

  useEffect(() => {
    setReady(detectWebGL() ? "webgl" : "static");
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <div className="hero-scene-fallback" />
      {ready === "webgl" && <HeroScene />}
    </div>
  );
}
