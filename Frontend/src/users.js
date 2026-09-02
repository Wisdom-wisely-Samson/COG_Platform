export const DEPT_LABELS = {
  '/pr':        'PR & Media',
  '/digital':   'Digital',
  '/creative':  'Creative',
  '/admin':     'Admin / Ops',
}

export function getUser() {
  try { return JSON.parse(sessionStorage.getItem('c1_user') || 'null') } catch { return null }
}

export function setUser(user, token) {
  sessionStorage.setItem('c1_user',  JSON.stringify(user))
  sessionStorage.setItem('c1_auth', '1')
  if (token) sessionStorage.setItem('c1_token', token)
}

export function clearUser() {
  sessionStorage.removeItem('c1_user')
  sessionStorage.removeItem('c1_auth')
  sessionStorage.removeItem('c1_token')
}

export function getToken() {
  return sessionStorage.getItem('c1_token') ?? null
}
