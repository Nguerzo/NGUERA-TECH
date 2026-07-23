import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type Capability = { name: string; desc: string };

export default function CapabilitiesIndex({ items }: { items: Capability[] }) {
  return (
    <div className="capabilities-index">
      {items.map((item, i) => (
        <Link href="/services" className="capabilities-row" key={item.name}>
          <span className="capabilities-row-num">{String(i + 1).padStart(2, "0")}</span>
          <h4>{item.name}</h4>
          <p>{item.desc}</p>
          <ArrowRight size={18} className="capabilities-row-arrow" />
        </Link>
      ))}
    </div>
  );
}
