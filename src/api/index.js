// =============================================================================
// NYAYAVAULT UNIFIED API CLIENT
// Connects React frontend directly to the live backend engine
// =============================================================================

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : (typeof import.meta !== 'undefined' && import.meta.env?.PROD ? 'https://nyayavault-backend-u03b.onrender.com/api' : '/api');


function getAuthHeader() {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('nyayavault_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeader(),
    ...options.headers
  };

  // If payload is not FormData, set Content-Type JSON
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication & RBAC
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    getProfile: () => request('/auth/me'),
    getUsers: () => request('/auth/users')
  },

  // Cases / FIR Management
  cases: {
    getAll: () => request('/cases'),
    getById: (id) => request(`/cases/${encodeURIComponent(id)}`),
    create: (caseData) => request('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    })
  },

  // Evidence Ingestion & Cryptography
  evidence: {
    getAll: () => request('/evidence'),
    getById: (id) => request(`/evidence/${encodeURIComponent(id)}`),
    upload: (formData) => request('/evidence/upload', {
      method: 'POST',
      body: formData // native FormData handles boundary headers
    }),
    getCertificateUrl: (id) => `${API_BASE}/evidence/${encodeURIComponent(id)}/certificate`,
    getDownloadUrl: (id, version = 'master') => `${API_BASE}/evidence/${encodeURIComponent(id)}/download?version=${version}`
  },

  // Verification Gateway
  verify: {
    byHash: (hash) => request(`/verify/${encodeURIComponent(hash)}`),
    byFile: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      return request('/verify/file', {
        method: 'POST',
        body: fd
      });
    }
  },

  // Chain of Custody
  custody: {
    getChain: (evidenceId = 'all') => request(`/custody/${encodeURIComponent(evidenceId)}`),
    appendHandoff: (handoffData) => request('/custody/handoff', {
      method: 'POST',
      body: JSON.stringify(handoffData)
    })
  },

  // Immutable Audit Trail
  audit: {
    getTrail: () => request('/audit'),
    log: (auditData) => request('/audit/log', {
      method: 'POST',
      body: JSON.stringify(auditData)
    }),
    deleteLog: (id) => request(`/audit/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
  }
};
