import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Search
} from "lucide-react";
import {
  createLead,
  deleteLead,
  getLeadStats,
  getLeads,
  updateLead
} from "./lib/api.js";
import { LeadForm } from "./components/LeadForm.jsx";
import { LeadTable } from "./components/LeadTable.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { STATUS_OPTIONS } from "./components/StatusBadge.jsx";

const sortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "name", label: "Name" },
  { value: "companyName", label: "Company" },
  { value: "status", label: "Status" },
  { value: "email", label: "Email" }
];

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadStats = useCallback(async () => {
    const response = await getLeadStats();
    setStats(response.data);
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getLeads(filters);
      setLeads(response.data);
      setMeta(response.meta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    loadStats().catch((requestError) => setError(requestError.message));
  }, [loadStats]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((current) => ({
        ...current,
        search: searchInput,
        page: 1
      }));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const pageLabel = useMemo(() => {
    const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `${start}-${end} of ${meta.total}`;
  }, [meta]);

  function updateFilters(nextFilters) {
    setFilters((current) => ({
      ...current,
      ...nextFilters,
      page: nextFilters.page ?? 1
    }));
  }

  function openCreateForm() {
    setEditingLead(null);
    setFormOpen(true);
  }

  function openEditForm(lead) {
    setEditingLead(lead);
    setFormOpen(true);
  }

  async function refreshDashboard() {
    await Promise.all([loadLeads(), loadStats()]);
  }

  async function submitLead(payload) {
    setSaving(true);
    setError("");

    try {
      if (editingLead) {
        await updateLead(editingLead._id, payload);
        setNotice("Lead updated");
      } else {
        await createLead(payload);
        setNotice("Lead created");
      }

      setFormOpen(false);
      setEditingLead(null);
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeLeadStatus(lead, status) {
    if (lead.status === status) {
      return;
    }

    setError("");

    try {
      await updateLead(lead._id, { status });
      setNotice("Status updated");
      await refreshDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function confirmDeleteLead() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteLead(deleteTarget._id);
      setNotice("Lead deleted");
      const nextPage =
        leads.length === 1 && filters.page > 1 ? filters.page - 1 : filters.page;
      setDeleteTarget(null);
      await loadStats();

      if (nextPage !== filters.page) {
        setFilters((current) => ({ ...current, page: nextPage }));
      } else {
        await loadLeads();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Small Business CRM</p>
          <h1>Lead Management</h1>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={refreshDashboard}>
            <RefreshCw size={17} />
            Refresh
          </button>
          <button className="primary-button" type="button" onClick={openCreateForm}>
            <Plus size={17} />
            Add Lead
          </button>
        </div>
      </header>

      <StatsPanel stats={stats} />

      <section className="toolbar" aria-label="Lead controls">
        <label className="search-field">
          <Search size={18} />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search name, email, or company"
          />
        </label>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => updateFilters({ status: event.target.value })}
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select
            value={filters.sortBy}
            onChange={(event) => updateFilters({ sortBy: event.target.value })}
          >
            {sortOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          className="icon-text-button"
          type="button"
          onClick={() =>
            updateFilters({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc"
            })
          }
          title="Change sort direction"
        >
          {filters.sortOrder === "asc" ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
          {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </section>

      {error ? <div className="alert error-alert">{error}</div> : null}
      {notice ? <div className="alert success-alert">{notice}</div> : null}

      <LeadTable
        leads={leads}
        loading={loading}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
        onStatusChange={changeLeadStatus}
      />

      <footer className="pagination-bar">
        <span>{pageLabel}</span>
        <div className="pagination-actions">
          <button
            className="icon-button"
            type="button"
            disabled={filters.page <= 1}
            onClick={() => updateFilters({ page: Math.max(filters.page - 1, 1) })}
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <strong>
            Page {meta.page} / {meta.totalPages}
          </strong>
          <button
            className="icon-button"
            type="button"
            disabled={filters.page >= meta.totalPages}
            onClick={() =>
              updateFilters({ page: Math.min(filters.page + 1, meta.totalPages) })
            }
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      <LeadForm
        lead={editingLead}
        open={formOpen}
        saving={saving}
        onClose={() => setFormOpen(false)}
        onSubmit={submitLead}
      />

      {deleteTarget ? (
        <div className="modal-backdrop" role="presentation">
          <section className="confirm-dialog" aria-modal="true" role="dialog">
            <div>
              <p className="eyebrow">Delete Lead</p>
              <h2>{deleteTarget.name}</h2>
            </div>
            <p>
              This lead will be removed from the CRM. This action cannot be undone.
            </p>
            <div className="form-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={confirmDeleteLead}
                disabled={deleting}
              >
                Delete Lead
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default App;
