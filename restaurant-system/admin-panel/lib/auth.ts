export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token')
  }
  return null
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token)
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token')
  }
}

export const getAuthHeaders = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
