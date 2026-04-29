const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
  } catch (_error) {
    throw new Error('Cannot connect to backend. Start backend on http://localhost:5000');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const authApi = {
  loginOrRegister: (payload) =>
    request('/auth/login-register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export const postsApi = {
  list: () => request('/posts'),
  create: (payload) =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  vote: (postId, type) =>
    request(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type })
    }),
  comment: (postId, payload) =>
    request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export const chatsApi = {
  start: (payload) =>
    request('/chats/start', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  list: (driverId) => request(`/chats?driverId=${driverId}`),
  messages: (conversationId) => request(`/chats/${conversationId}/messages`),
  sendMessage: (conversationId, payload) =>
    request(`/chats/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
export const walletApi = {
  get: (driverId) => request(`/wallet/${driverId}`),
  add: (driverId, amount) =>
    request(`/wallet/${driverId}/add`,{
      method: 'POST',
      body: JSON.stringify({ amount })
    }),
  withdraw: (driverId, payload)=>
    request(`/wallet/${driverId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  commission: (driverId, payload) =>
    request(`/wallet/${driverId}/commission`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
