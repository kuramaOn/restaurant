export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kitchen_token')
  }
  return null
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kitchen_token', token)
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kitchen_token')
  }
}

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
