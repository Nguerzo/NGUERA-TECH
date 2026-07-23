"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type ServiceItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  problems: string[];
  technologies: string[];
  example: string;
  cta: string;
};

type Labels = {
  benefits: string;
  problems: string;
  technologies: string;
  example: string;
  cta: string;
};

export default function ServicesExplorer({
  items,
  labels,
  detailHint,
}: {
  items: ServiceItem[];
  labels: Labels;
  detailHint: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];
  const reducedMotion = useReducedMotion();

  return (
    <div className="services-explorer">
      <div className="services-explorer-index">
        {items.map((item, i) => (
          <button
            type="button"
            key={item.slug}
            className={`services-explorer-row${i === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-current={i === activeIndex}
          >
            <span className="services-explorer-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="services-explorer-name">{item.name}</span>
            <span className="services-explorer-tagline">{item.tagline}</span>
          </button>
        ))}
      </div>

      <div className="services-explorer-detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="services-explorer-detail-eyebrow">{detailHint}</span>
            <h3>{active.name}</h3>
            <p className="services-explorer-detail-desc">{active.description}</p>

            <div className="services-explorer-detail-grid">
              <div>
                <span className="services-explorer-label">{labels.benefits}</span>
                <ul>
                  {active.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="services-explorer-label">{labels.problems}</span>
                <ul>
                  {active.problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="services-explorer-example">
              <span className="services-explorer-label">{labels.example}</span>
              <p>{active.example}</p>
            </div>

            <div className="services-explorer-tech">
              <span className="services-explorer-label">{labels.technologies}</span>
              <div className="services-explorer-tech-pills">
                {active.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            <Link href="/contact" className="btn-electric services-explorer-cta">
              {active.cta}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
