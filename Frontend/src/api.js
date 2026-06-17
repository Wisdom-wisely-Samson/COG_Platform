// Central API helper — all backend calls go through here.
// Vite proxies /api/* → http://localhost:5000 in development.

function getToken() {
  return sessionStorage.getItem('c1_token') ?? null
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }

  return data
}

// Multipart upload — lets the browser set Content-Type with boundary
async function upload(path, formData) {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`/api${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || `Upload failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // Auth
  login:          (email, password)                        => request('POST', '/auth/login',           { email, password }),
  getMe:          ()                                       => request('GET',  '/auth/me'),
  forgotPassword: (email)                                  => request('POST', '/auth/forgot-password', { email }),
  resetPassword:  (email, resetCode, newPassword)          => request('POST', '/auth/reset-password',  { email, resetCode, newPassword }),
  changePassword: (currentPassword, newPassword)           => request('POST', '/auth/change-password', { currentPassword, newPassword }),

  // Users
  getUsers:     ()            => request('GET',    '/users'),
  createUser:   (payload)     => request('POST',   '/users', payload),
  updateUser:   (id, payload) => request('PUT',    `/users/${id}`, payload),
  deleteUser:   (id)          => request('DELETE', `/users/${id}`),
  toggleActive: (id)          => request('PATCH',  `/users/${id}/active`),

  // Departments
  getDepartments: () => request('GET', '/departments'),

  // Tasks
  getTasks:          ()             => request('GET',    '/tasks'),
  createTask:        (formData)     => upload('/tasks', formData),
  updateTaskStatus:  (id, status)   => request('PATCH',  `/tasks/${id}/status`, { status }),
  deleteTask:        (id)           => request('DELETE', `/tasks/${id}`),

  // AI Evaluation
  evaluateTask: (taskId) => request('POST', `/evaluate/${taskId}`),

  // Notifications
  getNotifications:  ()   => request('GET',   '/notifications'),
  markNotifRead:     (id) => request('PATCH', `/notifications/${id}/read`, {}),
  markAllNotifsRead: ()   => request('PATCH', '/notifications/read-all', {}),
}
