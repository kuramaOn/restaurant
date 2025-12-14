import { getAuthHeaders } from './auth'

// Centralized API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init.headers || {}),
    },
    ...init,
  })
  
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  
  return res.json() as Promise<T>
}

// Menu API
export const menuApi = {
  getCategories: () => apiFetch('/menu/categories'),
  getItems: () => apiFetch('/menu/items'),
  getItem: (id: string) => apiFetch(`/menu/items/${id}`),
  createItem: (data: any) => apiFetch('/menu/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: any) => apiFetch(`/menu/items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteItem: (id: string) => apiFetch(`/menu/items/${id}`, { method: 'DELETE' }),
}

// Orders API
export const ordersApi = {
  getOrders: () => apiFetch('/orders'),
  getOrder: (id: string) => apiFetch(`/orders/${id}`),
  getKitchenOrders: () => apiFetch('/orders/kitchen'),
  createOrder: (data: any) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id: string, status: string) => 
    apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  processPayment: (id: string, data: any) => 
    apiFetch(`/orders/${id}/payment`, { method: 'POST', body: JSON.stringify(data) }),
}

// Tables API
export const tablesApi = {
  getTables: () => apiFetch('/tables'),
  getTable: (id: string) => apiFetch(`/tables/${id}`),
  createTable: (data: any) => apiFetch('/tables', { method: 'POST', body: JSON.stringify(data) }),
  updateTable: (id: string, data: any) => apiFetch(`/tables/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTable: (id: string) => apiFetch(`/tables/${id}`, { method: 'DELETE' }),
}

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) => 
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
}
