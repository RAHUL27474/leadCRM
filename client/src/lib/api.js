const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.message || "Request failed";
    throw new Error(message);
  }

  return payload;
}

export function getLeads(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return request(`/leads${query ? `?${query}` : ""}`);
}

export function getLeadStats() {
  return request("/leads/stats");
}

export function createLead(lead) {
  return request("/leads", {
    method: "POST",
    body: JSON.stringify(lead)
  });
}

export function updateLead(id, lead) {
  return request(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(lead)
  });
}

export function deleteLead(id) {
  return request(`/leads/${id}`, {
    method: "DELETE"
  });
}
