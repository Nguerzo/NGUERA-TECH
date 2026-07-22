import Link from "next/link";
import LogoMark from "@/components/Logo";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div style={{ maxWidth: 280 }}>
            <div className="logo" style={{ marginBottom: 14 }}>
              <LogoMark size={22} />
              NGUERA·TECH
            </div>
            <p style={{ fontSize: 13, color: "var(--ivory-faint)" }}>
              Building the Future with Artificial Intelligence. Dakar, Sénégal.
            </p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Entreprise</h5>
              <Link href="/services">Services</Link>
              <a href="#">Portfolio</a>
              <a href="#">Carrière</a>
            </div>
            <div className="footer-col">
              <h5>Ressources</h5>
              <Link href="/tarifs">Tarifs</Link>
              <a href="#">Blog</a>
              <a href="#">Documentation</a>
            </div>
            <div className="footer-col">
              <h5>Légal</h5>
              <a href="#">Confidentialité</a>
              <a href="#">CGU</a>
              <a href="#">Mentions légales</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NGUERA SENEGALENSIS TECH. Tous droits réservés.</span>
          <span style={{ fontFamily: "var(--mono)" }}>FR / EN</span>
        </div>
      </div>
    </footer>
  );
}
