import { Edit3, Trash2 } from "lucide-react";
import { STATUS_OPTIONS, StatusBadge } from "./StatusBadge.jsx";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return dateFormatter.format(new Date(value));
}

export function LeadTable({ leads, loading, onEdit, onDelete, onStatusChange }) {
  if (loading) {
    return (
      <div className="empty-state" role="status">
        Loading leads...
      </div>
    );
  }

  if (leads.length === 0) {
    return <div className="empty-state">No leads found.</div>;
  }

  return (
    <>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Created</th>
              <th>Notes</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                </td>
                <td>{lead.companyName}</td>
                <td>{lead.phone}</td>
                <td>
                  <div className="status-control">
                    <StatusBadge status={lead.status} />
                    <select
                      value={lead.status}
                      onChange={(event) => onStatusChange(lead, event.target.value)}
                      aria-label={`Update status for ${lead.name}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>{formatDate(lead.createdAt)}</td>
                <td className="notes-cell">{lead.notes || "N/A"}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => onEdit(lead)}
                      title={`Edit ${lead.name}`}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      className="icon-button danger"
                      type="button"
                      onClick={() => onDelete(lead)}
                      title={`Delete ${lead.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-list" aria-label="Lead list">
        {leads.map((lead) => (
          <article className="lead-card" key={lead._id}>
            <div className="lead-card-top">
              <div>
                <strong>{lead.name}</strong>
                <span>{lead.companyName}</span>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="lead-card-grid">
              <span>Email</span>
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
              <span>Phone</span>
              <a href={`tel:${lead.phone}`}>{lead.phone}</a>
              <span>Created</span>
              <strong>{formatDate(lead.createdAt)}</strong>
            </div>
            {lead.notes ? <p className="lead-card-notes">{lead.notes}</p> : null}
            <div className="lead-card-actions">
              <select
                value={lead.status}
                onChange={(event) => onStatusChange(lead, event.target.value)}
                aria-label={`Update status for ${lead.name}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="icon-button" type="button" onClick={() => onEdit(lead)} title="Edit">
                <Edit3 size={17} />
              </button>
              <button
                className="icon-button danger"
                type="button"
                onClick={() => onDelete(lead)}
                title="Delete"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
