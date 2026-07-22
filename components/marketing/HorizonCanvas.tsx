"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  baseY: number;
  phase: number;
  speed: number;
  len: number;
  opacity: number;
};

export default function HorizonCanvas({
  horizonRatio = 0.62,
  baobabScale = 1,
}: {
  horizonRatio?: number;
  baobabScale?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let t = 0;
    let rafId = 0;

    function initParticles() {
      particles = [];
      const cols = 40;
      const horizonY = H * horizonRatio;
      for (let i = 0; i < cols; i++) {
        particles.push({
          x: (i / cols) * W + (Math.random() * 20 - 10),
          baseY: horizonY,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6,
          len: 14 + Math.random() * (H * 0.14),
          opacity: 0.05 + Math.random() * 0.18,
        });
      }
    }

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function drawBaobab(x: number, y: number, scale: number, alpha: number) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.scale(scale, scale);
      ctx!.fillStyle = `rgba(10,14,20,${alpha})`;
      ctx!.strokeStyle = `rgba(201,120,46,${alpha * 0.5})`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.bezierCurveTo(-20, -10, -30, -60, -14, -90);
      ctx!.bezierCurveTo(-24, -100, -40, -95, -46, -110);
      ctx!.bezierCurveTo(-30, -108, -22, -100, -18, -96);
      ctx!.bezierCurveTo(-14, -118, -6, -128, 0, -140);
      ctx!.bezierCurveTo(6, -128, 14, -118, 18, -96);
      ctx!.bezierCurveTo(22, -100, 30, -108, 46, -110);
      ctx!.bezierCurveTo(40, -95, 24, -100, 14, -90);
      ctx!.bezierCurveTo(30, -60, 20, -10, 0, 0);
      ctx!.closePath();
      ctx!.fill();
      ctx!.stroke();
      ctx!.restore();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const horizonY = H * horizonRatio;

      const grad = ctx!.createLinearGradient(0, horizonY - 160, 0, horizonY + 40);
      grad.addColorStop(0, "rgba(232,180,77,0)");
      grad.addColorStop(1, "rgba(201,120,46,0.05)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, Math.max(0, horizonY - 160), W, 200);

      ctx!.strokeStyle = "rgba(242,238,230,0.08)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, horizonY);
      ctx!.lineTo(W, horizonY);
      ctx!.stroke();

      particles.forEach((p) => {
        const wob = reduced ? 0 : Math.sin(t * 0.001 * p.speed + p.phase) * 6;
        ctx!.strokeStyle = `rgba(77,217,232,${p.opacity})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(p.x + wob, p.baseY);
        ctx!.lineTo(p.x + wob * 0.4, p.baseY - p.len);
        ctx!.stroke();
        ctx!.fillStyle = `rgba(232,180,77,${p.opacity + 0.15})`;
        ctx!.beginPath();
        ctx!.arc(p.x + wob * 0.4, p.baseY - p.len, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      });

      drawBaobab(W * 0.78, horizonY, 1.1 * baobabScale, 0.5);
      drawBaobab(W * 0.86, horizonY, 0.65 * baobabScale, 0.35);

      if (!reduced) t += 16;
      rafId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [horizonRatio, baobabScale]);

  return <canvas className="hero-canvas" ref={canvasRef} />;
}
