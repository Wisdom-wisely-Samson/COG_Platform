<template>
  <div>

    <!-- Header row -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <div class="text-[13px] font-semibold">All Users</div>
        <div class="text-[11px] text-muted mt-0.5">Manage platform access, roles and departments</div>
      </div>
      <button @click="openAdd"
              class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 transition-opacity">
        <i class="ti ti-user-plus text-[15px]"></i>Add User
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Total Users</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">{{ users.length }}</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Active</div>
        <div class="text-[26px] font-semibold text-success leading-none">{{ users.filter(u => u.active).length }}</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Inactive</div>
        <div class="text-[26px] font-semibold text-muted leading-none">{{ users.filter(u => !u.active).length }}</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Departments</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">4</div>
      </div>
    </div>

    <!-- Search + filter bar -->
    <div class="flex items-center gap-2 mb-3">
      <div class="relative flex-1 max-w-xs">
        <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[14px]"></i>
        <input v-model="search" placeholder="Search by name or email…"
               class="bg-white border border-[#E1E4E9] rounded-md pl-8 pr-3 py-[7px] text-[12px] w-full focus:outline-none focus:border-accent transition-colors">
      </div>
      <select v-model="filterDept"
              class="bg-white border border-[#E1E4E9] rounded-md px-3 py-[7px] text-[12px] text-[#1A2332] focus:outline-none focus:border-accent cursor-pointer">
        <option value="">All Departments</option>
        <option value="/pr">PR & Media</option>
        <option value="/digital">Digital</option>
        <option value="/creative">Creative</option>
        <option value="/admin">Admin / Ops</option>
      </select>
      <select v-model="filterRole"
              class="bg-white border border-[#E1E4E9] rounded-md px-3 py-[7px] text-[12px] text-[#1A2332] focus:outline-none focus:border-accent cursor-pointer">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="head">Head Dept</option>
        <option value="staff">Staff</option>
      </select>
    </div>

    <!-- Users table -->
    <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
      <table class="w-full border-collapse text-xs">
        <thead>
          <tr class="bg-[#F9FAFB]">
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">User</th>
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Email</th>
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Role</th>
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Department</th>
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
            <th class="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-muted text-[12px]">No users match your filters.</td>
          </tr>
          <tr v-for="u in filtered" :key="u.id"
              class="hover:[&>td]:bg-[#F9FAFB] transition-colors"
              :class="{ 'opacity-50': !u.active }">

            <!-- User cell -->
            <td class="px-4 py-3 border-b border-[#E1E4E9]">
              <div class="flex items-center gap-2.5">
                <!-- Avatar -->
                <div class="w-8 h-8 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-white text-[11px] font-semibold"
                     :style="{ background: u.image ? 'transparent' : u.color }">
                  <img v-if="u.image" :src="u.image" class="w-full h-full object-cover" alt="">
                  <span v-else>{{ u.initials }}</span>
                </div>
                <div>
                  <div class="font-semibold text-[#1A2332] text-[12px]">{{ u.name }}</div>
                  <div class="text-[10px] text-muted">@{{ u.username }}</div>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-4 py-3 border-b border-[#E1E4E9] text-muted">{{ u.email }}</td>

            <!-- Role -->
            <td class="px-4 py-3 border-b border-[#E1E4E9]">
              <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border"
                    :class="u.role === 'admin'
                      ? 'bg-[#FDE8EC] text-accent border-[#F5C0CB]'
                      : u.role === 'head'
                        ? 'bg-[#F0EBF8] text-[#6B21A8] border-[#D8B4FE]'
                        : 'bg-[#E4EDF9] text-info border-[#B8D0F0]'">
                {{ u.role === 'admin' ? 'Admin' : u.role === 'head' ? 'Head Dept' : 'Staff' }}
              </span>
            </td>

            <!-- Department -->
            <td class="px-4 py-3 border-b border-[#E1E4E9]">
              <span v-if="u.dept" class="text-[10px] px-2 py-[3px] rounded-full font-medium border"
                    :class="deptClass(u.dept)">
                {{ DEPT_LABELS[u.dept] }}
              </span>
              <span v-else class="text-[10px] text-muted">All Depts</span>
            </td>

            <!-- Status toggle -->
            <td class="px-4 py-3 border-b border-[#E1E4E9]">
              <button @click="toggleActive(u)"
                      class="flex items-center gap-1.5 text-[10px] font-medium cursor-pointer border-none bg-transparent p-0">
                <div class="w-8 h-4 rounded-full transition-colors relative"
                     :class="u.active ? 'bg-success' : 'bg-[#D1D5DB]'">
                  <div class="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all"
                       :class="u.active ? 'left-[18px]' : 'left-0.5'"></div>
                </div>
                <span :class="u.active ? 'text-success' : 'text-muted'">{{ u.active ? 'Active' : 'Inactive' }}</span>
              </button>
            </td>

            <!-- Actions -->
            <td class="px-4 py-3 border-b border-[#E1E4E9]">
              <div class="flex items-center gap-1">
                <button @click="openEdit(u)"
                        class="w-7 h-7 rounded-md border border-[#E1E4E9] bg-white flex items-center justify-center text-muted hover:text-info hover:border-info transition-colors cursor-pointer">
                  <i class="ti ti-edit text-[13px]"></i>
                </button>
                <button @click="confirmDelete(u)"
                        class="w-7 h-7 rounded-md border border-[#E1E4E9] bg-white flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors cursor-pointer">
                  <i class="ti ti-trash text-[13px]"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== ADD / EDIT MODAL ===== -->
    <div v-show="showModal" @click.self="closeModal"
         class="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[12px] w-full max-w-[540px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-[#E1E4E9] flex items-center justify-between shrink-0">
          <div class="text-[14px] font-semibold">{{ editing ? 'Edit User' : 'Add New User' }}</div>
          <button @click="closeModal" class="bg-transparent border-none cursor-pointer text-muted text-lg hover:text-[#1A2332] leading-none">✕</button>
        </div>

        <!-- Modal body -->
        <div class="p-6 overflow-y-auto flex-1">

          <!-- Profile image upload -->
          <div class="flex items-center gap-4 mb-5">
            <div class="w-16 h-16 rounded-full border-2 border-dashed border-[#E1E4E9] overflow-hidden flex items-center justify-center shrink-0 relative group cursor-pointer hover:border-accent transition-colors"
                 :style="form.image ? 'border-style:solid' : ''"
                 @click="triggerImagePick">
              <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" alt="">
              <div v-else class="flex flex-col items-center justify-center text-muted">
                <i class="ti ti-user text-[22px]"></i>
              </div>
              <div class="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i class="ti ti-camera text-white text-[16px]"></i>
              </div>
              <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImagePick">
            </div>
            <div>
              <div class="text-[12px] font-medium text-[#1A2332] mb-0.5">Profile Photo</div>
              <div class="text-[11px] text-muted mb-1.5">Click the circle to upload. JPG, PNG — max 2MB</div>
              <button v-if="form.image" @click="form.image = ''"
                      class="text-[10px] text-accent hover:underline bg-transparent border-none cursor-pointer p-0">Remove photo</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">

            <!-- Full name -->
            <div class="col-span-2">
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Full Name</label>
              <input v-model="form.name" placeholder="e.g. Amara Nwosu"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors"
                     :class="{ 'border-accent/70 bg-[#FFF8F8]': errors.name }">
              <p v-if="errors.name" class="text-[10px] text-accent mt-1">{{ errors.name }}</p>
            </div>

            <!-- Username -->
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Username</label>
              <input v-model="form.username" placeholder="amara.nwosu"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors"
                     :class="{ 'border-accent/70 bg-[#FFF8F8]': errors.username }">
              <p v-if="errors.username" class="text-[10px] text-accent mt-1">{{ errors.username }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Email</label>
              <input v-model="form.email" type="email" placeholder="amara@capitalonegroup.com"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors"
                     :class="{ 'border-accent/70 bg-[#FFF8F8]': errors.email }">
              <p v-if="errors.email" class="text-[10px] text-accent mt-1">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="col-span-2">
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                Password <span v-if="editing" class="normal-case tracking-normal font-normal text-muted">(leave blank to keep current)</span>
              </label>
              <div class="relative">
                <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••"
                       class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full pr-10 focus:outline-none focus:border-accent transition-colors"
                       :class="{ 'border-accent/70 bg-[#FFF8F8]': errors.password }">
                <button type="button" @click="showPwd = !showPwd"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-[#1A2332] bg-transparent border-none cursor-pointer">
                  <i :class="showPwd ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-[15px]"></i>
                </button>
              </div>
              <p v-if="errors.password" class="text-[10px] text-accent mt-1">{{ errors.password }}</p>
            </div>

            <!-- Role -->
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Role</label>
              <select v-model="form.role"
                      class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent cursor-pointer">
                <option value="staff">Staff</option>
                <option value="head">Head Department</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <!-- Department -->
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Department</label>
              <select v-model="form.dept"
                      :disabled="form.role === 'admin'"
                      class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">— All Departments (Admin) —</option>
                <option value="/pr">PR &amp; Media</option>
                <option value="/digital">Digital</option>
                <option value="/creative">Creative</option>
                <option value="/admin">Admin / Ops</option>
              </select>
            </div>

            <!-- Status -->
            <div class="col-span-2 flex items-center gap-3 pt-1">
              <label class="text-[11px] font-semibold uppercase tracking-wider text-muted">Status</label>
              <button type="button" @click="form.active = !form.active"
                      class="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0">
                <div class="w-9 h-[20px] rounded-full transition-colors relative"
                     :class="form.active ? 'bg-success' : 'bg-[#D1D5DB]'">
                  <div class="absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-all"
                       :class="form.active ? 'left-[20px]' : 'left-[3px]'"></div>
                </div>
                <span class="text-[12px] font-medium" :class="form.active ? 'text-success' : 'text-muted'">
                  {{ form.active ? 'Active' : 'Inactive' }}
                </span>
              </button>
            </div>

          </div>
        </div>

        <!-- Modal footer -->
        <div class="px-6 py-3.5 border-t border-[#E1E4E9] flex justify-end gap-2 bg-[#F9FAFB] shrink-0">
          <button @click="closeModal"
                  class="inline-flex items-center gap-1.5 px-4 py-[7px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7] cursor-pointer">
            Cancel
          </button>
          <button @click="saveUser"
                  class="inline-flex items-center gap-1.5 px-4 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 cursor-pointer">
            <i class="ti ti-check text-[14px]"></i>
            {{ editing ? 'Save Changes' : 'Add User' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== DELETE CONFIRM ===== -->
    <div v-show="deleteTarget" @click.self="deleteTarget = null"
         class="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[12px] w-full max-w-[380px] shadow-2xl overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-[#FDE8EC] flex items-center justify-center mx-auto mb-4">
            <i class="ti ti-trash text-accent text-[22px]"></i>
          </div>
          <div class="text-[14px] font-semibold mb-1">Remove User</div>
          <div class="text-[12px] text-muted">
            Are you sure you want to remove <span class="font-semibold text-[#1A2332]">{{ deleteTarget?.name }}</span>?
            This action cannot be undone.
          </div>
        </div>
        <div class="px-6 pb-5 flex gap-2">
          <button @click="deleteTarget = null"
                  class="flex-1 py-[8px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7] cursor-pointer">
            Cancel
          </button>
          <button @click="deleteUser"
                  class="flex-1 py-[8px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 cursor-pointer">
            Remove
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { DEPT_LABELS } from '../users.js'
import { api } from '../api.js'

// ── Dept slug ↔ name mapping (matches backend seed) ──────────────────────────
const DEPT_NAME_TO_SLUG = {
  'PR & Media':  '/pr',
  'Digital':     '/digital',
  'Creative':    '/creative',
  'Admin / Ops': '/admin',
}

// ── State ─────────────────────────────────────────────────────────────────────
const users       = ref([])
const departments = ref([])  // [{ _id, name }]

// ── Load from API ─────────────────────────────────────────────────────────────
async function loadUsers() {
  try {
    const data = await api.getUsers()
    users.value = data
  } catch (e) {
    console.error('Failed to load users:', e.message)
  }
}

async function loadDepartments() {
  try {
    departments.value = await api.getDepartments()
  } catch (e) {
    console.error('Failed to load departments:', e.message)
  }
}

// Helper: convert dept slug to department ObjectId
function deptSlugToId(slug) {
  if (!slug) return null
  const slugToName = Object.fromEntries(
    Object.entries(DEPT_NAME_TO_SLUG).map(([name, s]) => [s, name])
  )
  const name = slugToName[slug]
  if (!name) return null
  const found = departments.value.find(d => d.name === name)
  return found ? found._id : null
}

onMounted(() => {
  loadUsers()
  loadDepartments()
})

// ── Filters ───────────────────────────────────────────────────────────────────
const search     = ref('')
const filterDept = ref('')
const filterRole = ref('')

const filtered = computed(() => users.value.filter(u => {
  const q = search.value.toLowerCase()
  if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false
  if (filterDept.value && u.dept !== filterDept.value) return false
  if (filterRole.value && u.role !== filterRole.value) return false
  return true
}))

// ── Modal state ───────────────────────────────────────────────────────────────
const showModal   = ref(false)
const editing     = ref(null)   // user id or null
const showPwd     = ref(false)
const deleteTarget = ref(null)
const imageInput  = ref(null)

const emptyForm = () => ({ name: '', username: '', email: '', password: '', role: 'staff', dept: '/pr', active: true, image: '' })
const form   = reactive(emptyForm())
const errors = reactive({})

function clearErrors() { Object.keys(errors).forEach(k => delete errors[k]) }

function openAdd() {
  editing.value = null
  Object.assign(form, emptyForm())
  clearErrors()
  showPwd.value  = false
  showModal.value = true
}

function openEdit(u) {
  editing.value = u.id
  Object.assign(form, { ...u })
  form.password = ''
  clearErrors()
  showPwd.value  = false
  showModal.value = true
}

function closeModal() { showModal.value = false }

function triggerImagePick() { imageInput.value?.click() }

function onImagePick(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return }
  const reader = new FileReader()
  reader.onload = ev => { form.image = ev.target.result }
  reader.readAsDataURL(file)
}

function validate() {
  clearErrors()
  if (!form.name.trim())  errors.name  = 'Full name is required.'
  if (!form.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'
  if (!editing.value && !form.password) errors.password = 'Password is required for new users.'
  return Object.keys(errors).length === 0
}

function initials(name) {
  return name.trim().split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}
const COLORS = ['#C41230','#1C5FAD','#2E7D32','#E07A00','#6B7896','#0D2B4F']

async function saveUser() {
  if (!validate()) return

  if (form.role === 'admin') form.dept = null

  const payload = {
    name:       form.name.trim(),
    email:      form.email.trim(),
    role:       form.role,
    department: deptSlugToId(form.dept),
    active:     form.active,
    ...(form.password ? { password: form.password } : {}),
  }

  try {
    if (editing.value) {
      const updated = await api.updateUser(editing.value, payload)
      const idx = users.value.findIndex(u => u.id === editing.value)
      if (idx !== -1) users.value[idx] = updated
    } else {
      const created = await api.createUser(payload)
      users.value.push(created)
    }
    closeModal()
  } catch (e) {
    alert(e.message || 'Failed to save user.')
  }
}

async function toggleActive(u) {
  try {
    const result = await api.toggleActive(u.id)
    u.active = result.active
  } catch (e) {
    alert(e.message || 'Failed to update status.')
  }
}

function confirmDelete(u) { deleteTarget.value = u }

async function deleteUser() {
  try {
    await api.deleteUser(deleteTarget.value.id)
    users.value = users.value.filter(u => u.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    alert(e.message || 'Failed to delete user.')
  }
}

// Dept badge style map
function deptClass(dept) {
  return {
    '/pr':       'bg-[#FDE8EC] text-accent border-[#F5C0CB]',
    '/digital':  'bg-[#E4EDF9] text-info border-[#B8D0F0]',
    '/creative': 'bg-[#EFF6E8] text-[#2E7D32] border-[#B6D9A8]',
    '/admin':    'bg-[#FEF3E0] text-warn border-[#FAD999]',
  }[dept] ?? 'bg-[#F4F5F7] text-muted border-[#E1E4E9]'
}
</script>
