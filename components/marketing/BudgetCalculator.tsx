"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatAmount } from "@/lib/currency";

type ProjectType = { key: string; label: string; min: number; max: number };
type Feature = { key: string; label: string; min: number; max: number };

const PROJECT_TYPES: ProjectType[] = [
  { key: "website", label: "Website or landing page", min: 1200, max: 3500 },
  { key: "platform", label: "Web platform or SaaS product", min: 5000, max: 15000 },
  { key: "mobile", label: "Mobile application", min: 6000, max: 18000 },
  { key: "ai", label: "AI or automation project", min: 4000, max: 12000 },
];

const FEATURES: Feature[] = [
  { key: "auth", label: "User accounts & authentication", min: 800, max: 1800 },
  { key: "payments", label: "Payments integration", min: 900, max: 2000 },
  { key: "dashboard", label: "Admin dashboard", min: 1200, max: 2800 },
  { key: "integrations", label: "Third-party integrations", min: 700, max: 1600 },
  { key: "multilang", label: "Multi-language support", min: 500, max: 1000 },
  { key: "ai", label: "AI or automation component", min: 1500, max: 4000 },
];

export type CalculatorLabels = {
  kicker: string;
  heading: string;
  typeLabel: string;
  featuresLabel: string;
  resultLabel: string;
  disclaimer: string;
  cta: string;
  projectTypes: Record<string, string>;
  features: Record<string, string>;
};

export default function BudgetCalculator({ labels }: { labels: CalculatorLabels }) {
  const [typeKey, setTypeKey] = useState(PROJECT_TYPES[0].key);
  const [selected, setSelected] = useState<string[]>([]);

  const { min, max } = useMemo(() => {
    const base = PROJECT_TYPES.find((t) => t.key === typeKey) ?? PROJECT_TYPES[0];
    const extras = FEATURES.filter((f) => selected.includes(f.key));
    return {
      min: base.min + extras.reduce((sum, f) => sum + f.min, 0),
      max: base.max + extras.reduce((sum, f) => sum + f.max, 0),
    };
  }, [typeKey, selected]);

  function toggleFeature(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  return (
    <div className="budget-calculator">
      <div className="budget-calculator-inputs">
        <div>
          <span className="services-explorer-label">{labels.typeLabel}</span>
          <div className="budget-calculator-options">
            {PROJECT_TYPES.map((t) => (
              <button
                type="button"
                key={t.key}
                className={`budget-calculator-option${typeKey === t.key ? " active" : ""}`}
                onClick={() => setTypeKey(t.key)}
              >
                {labels.projectTypes[t.key] ?? t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="services-explorer-label">{labels.featuresLabel}</span>
          <div className="budget-calculator-options">
            {FEATURES.map((f) => (
              <button
                type="button"
                key={f.key}
                className={`budget-calculator-option${selected.includes(f.key) ? " active" : ""}`}
                onClick={() => toggleFeature(f.key)}
              >
                {labels.features[f.key] ?? f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="budget-calculator-result">
        <span className="services-explorer-label">{labels.resultLabel}</span>
        <div className="budget-calculator-amount">
          {formatAmount(min, "GBP")} – {formatAmount(max, "GBP")}
        </div>
        <p className="budget-calculator-disclaimer">{labels.disclaimer}</p>
        <Link href="/contact" className="btn-electric">
          {labels.cta}
        </Link>
      </div>
    </div>
  );
}
