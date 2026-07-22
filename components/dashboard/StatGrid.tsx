"use client";

import { motion } from "framer-motion";

// icon est un élément déjà instancié (<FolderKanban />), pas la référence au composant :
// une référence de composant (fonction) ne peut pas traverser la frontière Server → Client Component.
export type Stat = {
  icon: React.ReactNode;
  value: string;
  label: string;
  variant?: "cyan" | "violet" | "ochre" | "alert";
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <motion.div className="dash-stat-grid" variants={container} initial="hidden" animate="show">
      {stats.map((s) => (
        <motion.div className="dash-stat-card" key={s.label} variants={item}>
          <div className={`dash-stat-icon${s.variant ? ` ${s.variant}` : ""}`}>{s.icon}</div>
          <div className="dash-stat-value">{s.value}</div>
          <div className="dash-stat-label">{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
