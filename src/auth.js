const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function saveAuth({ token, usuario }) {
  if (token) {
    localStorage.setItem('modasoft_token', token)
    if (typeof axios !== 'undefined') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
  if (usuario) {
    localStorage.setItem('modasoft_system_user', JSON.stringify(usuario))
  }
}

export function getUser() {
  try { 
    const userStr = localStorage.getItem('modasoft_system_user')
    return userStr ? JSON.parse(userStr) : null 
  } catch { 
    return null 
  }
}

export function logout() {
  localStorage.removeItem('modasoft_token')
  localStorage.removeItem('modasoft_system_user')
  if (typeof axios !== 'undefined') {
    delete axios.defaults.headers.common['Authorization']
  }
}

export function getToken() {
  return localStorage.getItem('modasoft_token')
}

export async function fetchMe() {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/usuarios/me`, { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    })
    if (!res.ok) {
      if (res.status === 401) {
        logout()
      }
      throw new Error(`HTTP ${res.status}`)
    }
    const data = await res.json()
    return data.usuario || data.user || null
  } catch (err) {
    console.error('Error fetchMe:', err)
    return null
  }
}

export default { saveAuth, getToken, getUser, logout, fetchMe }