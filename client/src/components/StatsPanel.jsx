import { BriefcaseBusiness, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { STATUS_OPTIONS } from "./StatusBadge.jsx";

const statusLabels = {
  New: "New",
  Contacted: "Contacted",
  Qualified: "Qualified",
  Converted: "Converted",
  Lost: "Lost"
};

export function StatsPanel({ stats }) {
  const byStatus = stats?.byStatus || {};

  return (
    <section className="stats-grid" aria-label="Lead statistics">
      <article className="stat-card">
        <div className="stat-icon stat-icon-total">
          <BriefcaseBusiness size={20} />
        </div>
        <div>
          <p>Total Leads</p>
          <strong>{stats?.total ?? 0}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-icon stat-icon-active">
          <Clock3 size={20} />
        </div>
        <div>
          <p>Active Pipeline</p>
          <strong>
            {(byStatus.New || 0) + (byStatus.Contacted || 0) + (byStatus.Qualified || 0)}
          </strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-icon stat-icon-converted">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p>Converted</p>
          <strong>{byStatus.Converted || 0}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-icon stat-icon-rate">
          <TrendingUp size={20} />
        </div>
        <div>
          <p>Conversion Rate</p>
          <strong>{stats?.conversionRate ?? 0}%</strong>
        </div>
      </article>

      <article className="status-summary">
        {STATUS_OPTIONS.map((status) => (
          <div className="status-row" key={status}>
            <span>{statusLabels[status]}</span>
            <strong>{byStatus[status] || 0}</strong>
          </div>
        ))}
      </article>
    </section>
  );
}
