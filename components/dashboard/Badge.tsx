import type { LucideIcon } from "lucide-react";

export default function Badge({
  icon: Icon,
  children,
  variant = "neutral",
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "neutral" | "cyan" | "gold" | "danger" | "violet";
}) {
  return (
    <span className={`dash-badge ${variant}`}>
      {Icon && <Icon />}
      {children}
    </span>
  );
}
