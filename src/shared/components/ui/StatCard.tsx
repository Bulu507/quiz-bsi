import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  trend,
  icon: Icon
}: {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}) {
  return (
    <article className="card stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={18} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="trend">{trend}</div>
    </article>
  );
}
