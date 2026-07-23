"use client";

import { Link } from "@/i18n/navigation";
import { useCurrency } from "./CurrencyProvider";
import { PRICE_TIERS, formatAmount } from "@/lib/currency";

export type PricingTierContent = {
  name: string;
  desc: string;
  features: string[];
  cta: string;
  from: string;
  custom: string;
};

export default function PricingTiers({
  starter,
  business,
  enterprise,
  featuredLabel,
}: {
  starter: PricingTierContent;
  business: PricingTierContent;
  enterprise: PricingTierContent;
  featuredLabel: string;
}) {
  const { currency } = useCurrency();

  return (
    <div className="pricing-tiers-v2">
      <div className="price-card-v2">
        <h3>{starter.name}</h3>
        <p className="price-desc-v2">{starter.desc}</p>
        <div className="price-from-v2">{starter.from}</div>
        <div className="price-amount-v2">{formatAmount(PRICE_TIERS.starter[currency], currency)}</div>
        <ul className="price-features-v2">
          {starter.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Link href="/contact" className="btn-outline price-cta-v2">
          {starter.cta}
        </Link>
      </div>

      <div className="price-card-v2 featured">
        <span className="price-badge-v2">{featuredLabel}</span>
        <h3>{business.name}</h3>
        <p className="price-desc-v2">{business.desc}</p>
        <div className="price-from-v2">{business.from}</div>
        <div className="price-amount-v2">{formatAmount(PRICE_TIERS.business[currency], currency)}</div>
        <ul className="price-features-v2">
          {business.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Link href="/contact" className="btn-electric price-cta-v2">
          {business.cta}
        </Link>
      </div>

      <div className="price-card-v2">
        <h3>{enterprise.name}</h3>
        <p className="price-desc-v2">{enterprise.desc}</p>
        <div className="price-from-v2">{enterprise.from}</div>
        <div className="price-amount-v2">{enterprise.custom}</div>
        <ul className="price-features-v2">
          {enterprise.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Link href="/contact" className="btn-outline price-cta-v2">
          {enterprise.cta}
        </Link>
      </div>
    </div>
  );
}
