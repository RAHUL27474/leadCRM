import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { STATUS_OPTIONS } from "./StatusBadge.jsx";

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  status: "New",
  notes: ""
};

export function LeadForm({ lead, open, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyLead);

  useEffect(() => {
    if (open) {
      setForm(lead ? { ...emptyLead, ...lead } : emptyLead);
    }
  }, [lead, open]);

  if (!open) {
    return null;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    onSubmit({
      name: form.name,
      email: form.email,
      phone: form.phone,
      companyName: form.companyName,
      status: form.status,
      notes: form.notes
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" aria-modal="true" role="dialog">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Lead</p>
            <h2>{lead ? "Edit Lead" : "Add Lead"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close form">
            <X size={18} />
          </button>
        </div>

        <form className="lead-form" onSubmit={submitForm}>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              maxLength={80}
              autoFocus
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
              maxLength={120}
            />
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              required
              maxLength={30}
            />
          </label>

          <label>
            Company Name
            <input
              name="companyName"
              value={form.companyName}
              onChange={updateField}
              required
              maxLength={120}
            />
          </label>

          <label>
            Lead Status
            <select name="status" value={form.status} onChange={updateField}>
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="full-field">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={updateField}
              maxLength={2000}
              rows={5}
            />
          </label>

          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={saving}>
              <Save size={17} />
              {saving ? "Saving" : "Save Lead"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
