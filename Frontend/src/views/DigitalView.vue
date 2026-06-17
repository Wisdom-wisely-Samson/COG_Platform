<template>
  <div>
    <!-- Tabs -->
    <div class="flex border-b border-[#E1E4E9] mb-5">
      <div @click="tab = 'briefs'" :class="tab==='briefs' ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Campaign Briefs</div>
      <div @click="tab = 'copy'"   :class="tab==='copy'   ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Copywriting</div>
      <div @click="tab = 'cal'"    :class="tab==='cal'    ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Content Calendar</div>
    </div>

    <!-- ── Campaign Briefs ─────────────────────────────────────────────────── -->
    <div v-show="tab === 'briefs'">
      <div class="flex items-center justify-between mb-3.5">
        <div class="text-[13px] font-semibold">Digital Briefs</div>
        <button @click="$emit('open-modal')" class="inline-flex items-center gap-1 px-3 py-[6px] rounded-md border border-accent bg-accent text-[11px] text-white hover:opacity-90">
          <i class="ti ti-plus"></i>New Brief
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loadingTasks" class="flex items-center justify-center py-12 text-muted text-xs gap-2">
        <i class="ti ti-loader-2 animate-spin text-base"></i> Loading briefs…
      </div>

      <div v-else class="grid gap-3.5" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
        <!-- Live task cards -->
        <div
          v-for="task in tasks"
          :key="task._id"
          class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer hover:border-accent/30 hover:shadow-md hover:-translate-y-px transition-all"
        >
          <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
            <div class="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-[#E4EDF9] text-info">
              <i class="ti ti-file-description"></i>
            </div>
            <div>
              <div class="text-[13px] font-semibold truncate max-w-[130px]">{{ task.title }}</div>
              <div class="text-[11px] text-muted mt-px">{{ formatDate(task.createdAt) }}</div>
            </div>
          </div>
          <div class="px-4 py-3.5 flex items-center justify-between gap-2">
            <div class="flex flex-wrap gap-1.5">
              <span :class="statusBadge(task.status).cls" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">
                {{ statusBadge(task.status).label }}
              </span>
            </div>
            <!-- Staff can mark pending tasks as "review" directly from the card -->
            <button
              v-if="task.status === 'pending'"
              @click.stop="markReview(task)"
              :disabled="updatingId === task._id"
              class="text-[10px] px-2 py-[3px] rounded-full font-medium border border-accent text-accent hover:bg-accent hover:text-white transition-colors disabled:opacity-50"
            >
              {{ updatingId === task._id ? '…' : 'Submit' }}
            </button>
          </div>
        </div>

        <!-- Upload new brief card -->
        <div @click="$emit('open-modal')" class="bg-white border-2 border-dashed border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer hover:border-accent/40 transition-all">
          <div class="py-7 px-4 text-center text-muted">
            <i class="ti ti-plus text-[24px]"></i>
            <div class="text-xs mt-1.5">Upload New Brief</div>
          </div>
        </div>
      </div>

      <!-- Update error -->
      <div v-if="updateError" class="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#FEE8E8] border border-[#F5BFBF] text-[#C41230] text-xs font-medium">
        <i class="ti ti-alert-circle text-base"></i>{{ updateError }}
      </div>
    </div>

    <!-- ── Copywriting ──────────────────────────────────────────────────────── -->
    <div v-show="tab === 'copy'">
      <!-- Success banner -->
      <div v-if="copySuccess" class="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#E6F7EF] border border-[#B6E6D0] text-success text-xs font-medium">
        <i class="ti ti-circle-check text-base"></i>{{ copySuccess }}
      </div>
      <!-- Error banner -->
      <div v-if="copyError" class="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#FEE8E8] border border-[#F5BFBF] text-[#C41230] text-xs font-medium">
        <i class="ti ti-alert-circle text-base"></i>{{ copyError }}
      </div>

      <!-- Platform selector -->
      <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Platform</label>
      <div class="flex gap-2 mb-4">
        <button
          v-for="p in platforms" :key="p"
          @click="selectedPlatform = p"
          :class="selectedPlatform === p
            ? 'bg-[#E4EDF9] text-info border-[#B8D0F0]'
            : 'border-[#E1E4E9] bg-white text-muted hover:bg-[#F4F5F7]'"
          class="inline-flex items-center px-3.5 py-[7px] rounded-md border text-[11px] cursor-pointer transition-colors"
        >{{ p }}</button>
      </div>

      <!-- Caption -->
      <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Post Caption <span class="text-[#C41230]">*</span></label>
      <textarea
        v-model="caption"
        class="bg-white border border-[#E1E4E9] rounded-md p-3 text-[13px] leading-relaxed min-h-[100px] text-[#1A2332] resize-y w-full focus:outline-none focus:border-accent"
        rows="5"
        placeholder="Write your post caption here…"
      ></textarea>

      <!-- Hashtags -->
      <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5 mt-3">Hashtags</label>
      <textarea
        v-model="hashtags"
        class="bg-white border border-[#E1E4E9] rounded-md p-3 text-[13px] leading-relaxed text-[#1A2332] resize-y w-full focus:outline-none focus:border-accent"
        rows="2"
        placeholder="#CapiPay #CapitalOneGroup …"
      ></textarea>

      <!-- Actions -->
      <div class="mt-2.5 flex gap-2 justify-end">
        <button
          @click="submitCopy('pending')"
          :disabled="copySubmitting"
          class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7] disabled:opacity-50"
        >Save Draft</button>
        <button
          @click="submitCopy('review')"
          :disabled="copySubmitting"
          class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 disabled:opacity-50"
        >
          <i v-if="copySubmitting" class="ti ti-loader-2 animate-spin text-sm"></i>
          {{ copySubmitting ? 'Submitting…' : 'Mark Ready for Review' }}
        </button>
      </div>
    </div>

    <!-- ── Content Calendar ────────────────────────────────────────────────── -->
    <div v-show="tab === 'cal'">
      <!-- Cal update error -->
      <div v-if="calError" class="mb-3 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#FEE8E8] border border-[#F5BFBF] text-[#C41230] text-xs font-medium">
        <i class="ti ti-alert-circle text-base"></i>{{ calError }}
      </div>

      <!-- Loading -->
      <div v-if="loadingTasks" class="flex items-center justify-center py-12 text-muted text-xs gap-2">
        <i class="ti ti-loader-2 animate-spin text-base"></i> Loading calendar…
      </div>

      <!-- Empty state -->
      <div v-else-if="tasks.length === 0" class="bg-white border border-[#E1E4E9] rounded-[10px] py-12 text-center text-muted text-xs">
        No tasks yet. Use the <span class="font-semibold text-[#1A2332]">Copywriting</span> tab to create your first entry.
      </div>

      <!-- Table -->
      <div v-else class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Date</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Title</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Submitted By</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Notes</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(task, i) in tasks"
              :key="task._id"
              class="hover:[&>td]:bg-[#F4F5F7]"
            >
              <td class="px-3 py-2.5 whitespace-nowrap" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                {{ formatDate(task.createdAt) }}
              </td>
              <td class="px-3 py-2.5 font-medium max-w-[160px] truncate" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                {{ task.title }}
              </td>
              <td class="px-3 py-2.5" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-accent/10 text-accent text-[9px] font-bold flex items-center justify-center shrink-0">
                    {{ initials(task.createdBy?.fullName) }}
                  </div>
                  <span class="truncate max-w-[100px]">{{ task.createdBy?.fullName || '—' }}</span>
                </div>
              </td>
              <td class="px-3 py-2.5 text-muted max-w-[200px] truncate" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                {{ task.notes || '—' }}
              </td>
              <td class="px-3 py-2.5" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                <span :class="statusBadge(task.status).cls" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">
                  {{ statusBadge(task.status).label }}
                </span>
              </td>
              <td class="px-3 py-2.5" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                <button
                  v-if="task.status === 'pending'"
                  @click="calMarkReview(task)"
                  :disabled="calUpdatingId === task._id"
                  class="inline-flex items-center gap-1 px-2.5 py-[5px] rounded-md border border-accent bg-accent text-[10px] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <i v-if="calUpdatingId === task._id" class="ti ti-loader-2 animate-spin text-xs"></i>
                  {{ calUpdatingId === task._id ? '…' : 'Submit for Review' }}
                </button>
                <span v-else class="text-[11px] text-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api.js'

defineEmits(['open-modal'])

const tab = ref('briefs')

// ── Task list (shared: Briefs + Calendar) ─────────────────────────────────────
const tasks        = ref([])
const loadingTasks = ref(false)

// Briefs tab
const updatingId  = ref(null)
const updateError = ref('')

// Calendar tab
const calUpdatingId = ref(null)
const calError      = ref('')

async function loadTasks() {
  loadingTasks.value = true
  try {
    const all = await api.getTasks()
    tasks.value = all.filter(t => t.departmentName === 'Digital')
  } catch {
    // silently fail
  } finally {
    loadingTasks.value = false
  }
}

onMounted(loadTasks)

// Mark an existing pending task as 'review' directly from the brief card
async function markReview(task) {
  updateError.value = ''
  updatingId.value  = task._id
  try {
    const updated = await api.updateTaskStatus(task._id, 'review')
    const idx = tasks.value.findIndex(t => t._id === task._id)
    if (idx !== -1) tasks.value[idx] = updated
  } catch (err) {
    updateError.value = err.message || 'Failed to update status.'
  } finally {
    updatingId.value = null
  }
}

// Submit for review directly from the Content Calendar row
async function calMarkReview(task) {
  calError.value      = ''
  calUpdatingId.value = task._id
  try {
    const updated = await api.updateTaskStatus(task._id, 'review')
    const idx = tasks.value.findIndex(t => t._id === task._id)
    if (idx !== -1) tasks.value[idx] = updated
  } catch (err) {
    calError.value = err.message || 'Failed to update status.'
  } finally {
    calUpdatingId.value = null
  }
}

// ── Copywriting form ──────────────────────────────────────────────────────────
const platforms       = ['Instagram', 'Twitter/X', 'Facebook', 'LinkedIn']
const selectedPlatform = ref('Instagram')
const caption         = ref('')
const hashtags        = ref('')
const copySubmitting  = ref(false)
const copySuccess     = ref('')
const copyError       = ref('')

async function submitCopy(status) {
  copySuccess.value = ''
  copyError.value   = ''

  if (!caption.value.trim()) {
    copyError.value = 'Post caption is required.'
    return
  }

  const notes = [
    caption.value.trim(),
    hashtags.value.trim() ? `Hashtags: ${hashtags.value.trim()}` : '',
  ].filter(Boolean).join('\n\n')

  const fd = new FormData()
  fd.append('title',          `${selectedPlatform.value} Copy — ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}`)
  fd.append('departmentName', 'Digital')
  fd.append('notes',          notes)
  fd.append('priority',       'Medium')
  fd.append('status',         status)

  copySubmitting.value = true
  try {
    await api.createTask(fd)
    copySuccess.value = status === 'review'
      ? 'Submitted for review successfully!'
      : 'Saved as draft.'
    caption.value   = ''
    hashtags.value  = ''
    await loadTasks()
    if (status === 'review') tab.value = 'briefs'
  } catch (err) {
    copyError.value = err.message || 'Submission failed. Please try again.'
  } finally {
    copySubmitting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name) {
  if (!name) return '?'
  return name.trim().split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
  switch (status) {
    case 'completed':   return { label: 'Approved',     cls: 'bg-[#E6F7EF] text-success border-[#B6E6D0]' }
    case 'review':      return { label: 'In Review',    cls: 'bg-[#FEF3E0] text-warn border-[#FAD999]' }
    case 'in_progress': return { label: 'In Progress',  cls: 'bg-[#E4EDF9] text-info border-[#B8D0F0]' }
    default:            return { label: 'Draft',        cls: 'bg-[#F4F5F7] text-muted border-[#E1E4E9]' }
  }
}
</script>
