"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Act = { label: string; text: string };

const GRAPHICS = [
  // 01 — global network: scattered nodes
  <svg key="0" viewBox="0 0 200 200" fill="none">
    {[...Array(18)].map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = 45 + (i % 3) * 20;
      const x = Number((100 + Math.cos(a) * r).toFixed(2));
      const y = Number((100 + Math.sin(a) * r).toFixed(2));
      return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3.5 : 2} fill="#8FD9FF" opacity={0.8} />;
    })}
    <circle cx="100" cy="100" r="4" fill="#3B6BFF" />
  </svg>,
  // 02 — software architecture: grid/modules
  <svg key="1" viewBox="0 0 200 200" fill="none">
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <rect
          key={`${r}-${c}`}
          x={40 + c * 45}
          y={40 + r * 45}
          width="32"
          height="32"
          rx="4"
          stroke="#3B6BFF"
          strokeWidth="1.4"
          fill={r === 1 && c === 1 ? "#3B6BFF33" : "none"}
        />
      ))
    )}
  </svg>,
  // 03 — live intelligence: bar chart / dashboard
  <svg key="2" viewBox="0 0 200 200" fill="none">
    <rect x="30" y="30" width="140" height="140" rx="8" stroke="#8FD9FF" strokeWidth="1.4" />
    {[60, 90, 45, 110, 75].map((h, i) => (
      <rect key={i} x={45 + i * 24} y={150 - h * 0.6} width="14" height={h * 0.6} rx="2" fill="#3B6BFF" opacity={0.7 + i * 0.05} />
    ))}
  </svg>,
  // 04 — secure infrastructure: shield lines
  <svg key="3" viewBox="0 0 200 200" fill="none">
    <path d="M100 30 L160 55 V100 C160 140 135 165 100 175 C65 165 40 140 40 100 V55 Z" stroke="#3B6BFF" strokeWidth="1.6" />
    <path d="M75 100 L92 118 L128 78" stroke="#8FD9FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export default function ScrollNarrative({ acts }: { acts: Act[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const graphicRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(actRefs.current.slice(1), { opacity: 0.25 });
      gsap.set(graphicRefs.current.slice(1), { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${acts.length * 90}%`,
          scrub: 0.6,
          pin: true,
        },
      });

      acts.forEach((_, i) => {
        if (i > 0) {
          tl.to(actRefs.current[i - 1], { opacity: 0.25, duration: 0.3 }, `act${i}`);
          tl.to(graphicRefs.current[i - 1], { opacity: 0, scale: 0.9, duration: 0.3 }, `act${i}`);
          tl.to(actRefs.current[i], { opacity: 1, duration: 0.3 }, `act${i}`);
          tl.to(graphicRefs.current[i], { opacity: 1, scale: 1, duration: 0.3 }, `act${i}`);
        }
        if (progressRef.current) {
          tl.to(progressRef.current, { "--p": i / (acts.length - 1), duration: 0.3 } as gsap.TweenVars, i > 0 ? "<" : 0);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [acts]);

  return (
    <section className="narrative" ref={sectionRef}>
      <div className="wrap narrative-inner">
        <div className="narrative-text">
          {acts.map((act, i) => (
            <div
              key={act.label}
              className="narrative-act"
              ref={(el) => {
                actRefs.current[i] = el;
              }}
            >
              <span className="narrative-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{act.label}</h3>
              <p>{act.text}</p>
            </div>
          ))}
          <div className="narrative-progress">
            <div className="narrative-progress-track" ref={progressRef} />
          </div>
        </div>
        <div className="narrative-graphic">
          {GRAPHICS.map((g, i) => (
            <div
              className="narrative-graphic-layer"
              key={i}
              ref={(el) => {
                graphicRefs.current[i] = el;
              }}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
