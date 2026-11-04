const base = '/api';

async function request(path, options = {}) {
  const res = await fetch(base + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}) ${text}`.trim());
  }
  return res.json();
}

const body = (data) => ({ body: JSON.stringify(data) });

export const api = {
  contacts: () => request('/contacts'),
  threads: () => request('/threads'),
  createThread: (contactId) => request('/threads', { method: 'POST', ...body({ contactId }) }),
  messages: (threadId) => request(`/threads/${threadId}/messages`),
  sendMessage: (threadId, text) => request(`/threads/${threadId}/messages`, { method: 'POST', ...body({ body: text }) }),
  markRead: (threadId) => request(`/threads/${threadId}/read`, { method: 'POST' }),
  calls: () => request('/calls'),
  logCall: (call) => request('/calls', { method: 'POST', ...body(call) }),
  notes: () => request('/notes'),
  createNote: (note) => request('/notes', { method: 'POST', ...body(note) }),
  updateNote: (id, patch) => request(`/notes/${id}`, { method: 'PATCH', ...body(patch) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  photos: () => request('/photos'),
  settings: () => request('/settings'),
  saveSettings: (patch) => request('/settings', { method: 'PUT', ...body(patch) }),
};
