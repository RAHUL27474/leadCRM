export const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost"
];

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}
