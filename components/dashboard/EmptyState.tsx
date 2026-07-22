import type { LucideIcon } from "lucide-react";

export default function EmptyState({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="dash-empty">
      <Icon />
      <p>{children}</p>
    </div>
  );
}
