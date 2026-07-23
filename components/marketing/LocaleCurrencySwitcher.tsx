"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "./CurrencyProvider";

const LOCALES: { code: "en" | "fr"; label: string }[] = [
  { code: "en", label: "English (UK)" },
  { code: "fr", label: "Français" },
];

export default function LocaleCurrencySwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="locale-switcher" ref={ref}>
      <button type="button" className="locale-switcher-trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Globe size={14} />
        {locale.toUpperCase()} · {currency}
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="locale-switcher-panel">
          <div className="locale-switcher-group">
            <span>{t("language")}</span>
            {LOCALES.map((l) => (
              <Link key={l.code} href={pathname} locale={l.code} className={l.code === locale ? "active" : ""} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="locale-switcher-group">
            <span>{t("currency")}</span>
            {CURRENCIES.map((c) => (
              <button
                type="button"
                key={c.code}
                className={c.code === currency ? "active" : ""}
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
