const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  // Ensure the URL starts with a slash
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  const res = await fetch(`${BASE}${normalizedUrl}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// Auth
export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ user: any }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ user: any }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: any }>('/api/auth/me'),
};

// Products
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/api/products${qs}`);
  },
  getById: (id: string) => request<any>(`/api/products/${id}`),
};

// Orders
export const ordersApi = {
  create: (body: any) =>
    request<any>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  getUserOrders: () => request<any[]>('/api/orders'),
  track: (orderId: string) =>
    request<any>(`/api/orders/track?orderId=${encodeURIComponent(orderId)}`),
};

// Admin
export const adminApi = {
  getOrders: () => request<any[]>('/api/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id: string) =>
    request<{ message: string }>(`/api/admin/orders/${id}`, { method: 'DELETE' }),
  getStats: () => request<any>('/api/admin/stats'),
  createProduct: (body: any) =>
    request<any>('/api/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: any) =>
    request<any>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) =>
    request<{ message: string }>(`/api/admin/products/${id}`, { method: 'DELETE' }),
};
