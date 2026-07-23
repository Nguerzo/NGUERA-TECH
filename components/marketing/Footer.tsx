import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LogoMark from "@/components/Logo";
import LiveClock from "./LiveClock";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div style={{ maxWidth: 300 }}>
            <div className="logo" style={{ marginBottom: 14 }}>
              <LogoMark size={22} />
              NGUERA·TECH
            </div>
            <p style={{ fontSize: 13, color: "var(--white-faint)" }}>{t("tagline")}</p>
            <p style={{ fontSize: 12, color: "var(--white-faint)", marginTop: 10 }}>{t("servingLine")}</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>{t("company")}</h5>
              <Link href="/services">{nav("services")}</Link>
              <Link href="/portfolio">{nav("portfolio")}</Link>
              <Link href="/about">{nav("about")}</Link>
              <a href="#">{t("careers")}</a>
            </div>
            <div className="footer-col">
              <h5>{t("resources")}</h5>
              <Link href="/pricing">{nav("pricing")}</Link>
              <a href="#">{t("blog")}</a>
              <a href="#">{t("documentation")}</a>
            </div>
            <div className="footer-col">
              <h5>{t("legal")}</h5>
              <a href="#">{t("privacy")}</a>
              <a href="#">{t("terms")}</a>
              <a href="#">{t("cookies")}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NGUERA SENEGALENSIS TECH. {t("rights")}</span>
          <LiveClock label={t("liveClockLabel")} />
        </div>
      </div>
    </footer>
  );
}
