// Demo user accounts
// role: 'admin'  → Super Admin, sees full platform
// role: 'head'   → Head of Department, sees own dept + can log activities
// role: 'staff'  → sees only their dept route
export const USERS = {
  'admin@capitalonegroup.com':  { name: 'Super Admin',    initials: 'SA', role: 'admin', dept: null,        color: '#FF6600' },
  'amara@capitalonegroup.com':  { name: 'Amara Nwosu',    initials: 'AN', role: 'head',  dept: '/pr',        color: '#FF6600' },
  'chisom@capitalonegroup.com': { name: 'Chisom Eze',     initials: 'CE', role: 'staff', dept: '/pr',        color: '#FF6600' },
  'kemi@capitalonegroup.com':   { name: 'Kemi Obi',       initials: 'KO', role: 'head',  dept: '/digital',   color: '#FF6600' },
  'bayo@capitalonegroup.com':   { name: 'Bayo Adeyemi',   initials: 'BA', role: 'staff', dept: '/digital',   color: '#FF6600' },
  'tunde@capitalonegroup.com':  { name: 'Tunde Makinde',  initials: 'TM', role: 'head',  dept: '/creative',  color: '#FF6600' },
  'osas@capitalonegroup.com':   { name: 'Osas Idehen',    initials: 'OI', role: 'staff', dept: '/creative',  color: '#FF6600' },
  'funmi@capitalonegroup.com':  { name: 'Funmi Adeola',   initials: 'FA', role: 'head',  dept: '/admin',     color: '#FF6600' },
}

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
