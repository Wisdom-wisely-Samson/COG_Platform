<template>
  <div>
    <!-- Tabs -->
    <div class="flex border-b border-[#E1E4E9] mb-5">
      <div @click="tab = 'log'"    :class="tab==='log'    ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Activity Log</div>
      <div @click="tab = 'upload'" :class="tab==='upload' ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Upload Media</div>
      <div @click="tab = 'events'" :class="tab==='events' ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Events</div>
    </div>

    <!-- Activity Log -->
    <div v-show="tab === 'log'">
      <!-- Stats -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
          <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Total Submissions</div>
          <div class="text-[26px] font-semibold leading-none">{{ tasks.length }}</div>
        </div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
          <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Files Uploaded</div>
          <div class="text-[26px] font-semibold text-info leading-none">{{ totalFiles }}</div>
        </div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
          <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Under Review</div>
          <div class="text-[26px] font-semibold text-warn leading-none">{{ reviewCount }}</div>
        </div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
          <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Approved</div>
          <div class="text-[26px] font-semibold text-success leading-none">{{ approvedCount }}</div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingTasks" class="flex items-center justify-center py-12 text-muted text-xs gap-2">
        <i class="ti ti-loader-2 animate-spin text-base"></i> Loading activity log…
      </div>

      <!-- Empty state -->
      <div v-else-if="tasks.length === 0" class="bg-white border border-[#E1E4E9] rounded-[10px] py-12 text-center text-muted text-xs">
        No submissions yet. Use the <span class="font-semibold text-[#1A2332]">Upload Media</span> tab to submit your first activity.
      </div>

      <!-- Table -->
      <div v-else class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Event / Campaign</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Files</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Notes</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Submitted</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, i) in tasks" :key="task._id" class="hover:[&>td]:bg-[#F4F5F7]">
              <td class="px-3 py-2.5 font-medium" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">{{ task.title }}</td>
              <td class="px-3 py-2.5 text-muted" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                {{ task.attachments?.length ? task.attachments.length + ' file' + (task.attachments.length > 1 ? 's' : '') : '—' }}
              </td>
              <td class="px-3 py-2.5 text-muted max-w-[220px] truncate" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                {{ task.notes || '—' }}
              </td>
              <td class="px-3 py-2.5 text-muted" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">{{ formatDate(task.createdAt) }}</td>
              <td class="px-3 py-2.5" :class="i < tasks.length-1 ? 'border-b border-[#E1E4E9]' : ''">
                <span :class="statusBadge(task.status).cls" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">
                  {{ statusBadge(task.status).label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upload Media -->
    <div v-show="tab === 'upload'">
      <!-- Success banner -->
      <div v-if="successMsg" class="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#E6F7EF] border border-[#B6E6D0] text-success text-xs font-medium">
        <i class="ti ti-circle-check text-base"></i>{{ successMsg }}
      </div>
      <!-- Error banner -->
      <div v-if="errorMsg" class="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-md bg-[#FEE8E8] border border-[#F5BFBF] text-[#C41230] text-xs font-medium">
        <i class="ti ti-alert-circle text-base"></i>{{ errorMsg }}
      </div>

      <div class="grid grid-cols-3 gap-3">
        <!-- Newspaper Cutouts -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Newspaper Cutouts</label>
          <div
            class="border-2 border-dashed rounded-[10px] p-5 text-center cursor-pointer bg-[#F9FAFB] transition-all"
            :class="isDraggingCutouts ? 'border-accent bg-accent/[0.03]' : 'border-[#E1E4E9] hover:border-accent hover:bg-accent/[0.03]'"
            @click="cutoutInput.click()"
            @dragover.prevent="isDraggingCutouts = true"
            @dragleave.prevent="isDraggingCutouts = false"
            @drop.prevent="onDropCutouts"
          >
            <div class="text-[24px] text-muted mb-1.5"><i class="ti ti-photo"></i></div>
            <div class="text-xs font-medium mb-0.5">Upload scanned clippings</div>
            <div class="text-[11px] text-muted">JPEG, PNG, PDF — max 10MB</div>
          </div>
          <input ref="cutoutInput" type="file" multiple accept=".jpg,.jpeg,.png,.pdf" class="hidden" @change="onPickCutouts" />
          <!-- Cutout file list -->
          <div v-if="cutoutFiles.length" class="mt-2 space-y-1">
            <div v-for="(f, i) in cutoutFiles" :key="i" class="flex items-center justify-between px-2 py-1 bg-white border border-[#E1E4E9] rounded text-[11px]">
              <span class="truncate max-w-[140px]">{{ f.name }}</span>
              <button @click="cutoutFiles.splice(i,1)" class="text-muted hover:text-[#C41230] ml-1"><i class="ti ti-x text-xs"></i></button>
            </div>
          </div>
        </div>

        <!-- Media Coverage Links -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Media Coverage Links</label>
          <div v-for="(link, i) in mediaLinks" :key="i" class="flex items-center border border-[#E1E4E9] rounded-md overflow-hidden mb-2">
            <span class="px-2.5 py-[9px] bg-[#F9FAFB] text-[13px] text-muted border-r border-[#E1E4E9] font-mono">https://</span>
            <input v-model="mediaLinks[i]" class="flex-1 border-none px-3 py-[9px] text-xs bg-transparent text-[#1A2332] focus:outline-none" :placeholder="i === 0 ? 'youtube.com/watch?v=...' : 'Add another link...'">
            <button v-if="mediaLinks.length > 1" @click="mediaLinks.splice(i,1)" class="px-2 text-muted hover:text-[#C41230]"><i class="ti ti-x text-xs"></i></button>
          </div>
          <button @click="mediaLinks.push('')" class="text-[11px] text-accent hover:underline">+ Add link</button>
        </div>

        <!-- Media Kits -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Media Kits</label>
          <div
            class="border-2 border-dashed rounded-[10px] p-5 text-center cursor-pointer bg-[#F9FAFB] transition-all"
            :class="isDraggingKits ? 'border-accent bg-accent/[0.03]' : 'border-[#E1E4E9] hover:border-accent hover:bg-accent/[0.03]'"
            @click="kitInput.click()"
            @dragover.prevent="isDraggingKits = true"
            @dragleave.prevent="isDraggingKits = false"
            @drop.prevent="onDropKits"
          >
            <div class="text-[24px] text-muted mb-1.5"><i class="ti ti-file-zip"></i></div>
            <div class="text-xs font-medium mb-0.5">Attach media kit files</div>
            <div class="text-[11px] text-muted">PDF, DOCX, ZIP — max 10MB</div>
          </div>
          <input ref="kitInput" type="file" multiple accept=".pdf,.doc,.docx,.zip" class="hidden" @change="onPickKits" />
          <!-- Kit file list -->
          <div v-if="kitFiles.length" class="mt-2 space-y-1">
            <div v-for="(f, i) in kitFiles" :key="i" class="flex items-center justify-between px-2 py-1 bg-white border border-[#E1E4E9] rounded text-[11px]">
              <span class="truncate max-w-[140px]">{{ f.name }}</span>
              <button @click="kitFiles.splice(i,1)" class="text-muted hover:text-[#C41230] ml-1"><i class="ti ti-x text-xs"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Event / Campaign Name -->
      <div class="mt-4">
        <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Event / Campaign Name <span class="text-[#C41230]">*</span></label>
        <input v-model="eventName" class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent" placeholder="e.g. Annual General Meeting 2025">
      </div>

      <!-- Activity Notes -->
      <div class="mt-2.5">
        <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Activity Notes</label>
        <textarea v-model="activityNotes" class="bg-white border border-[#E1E4E9] rounded-md p-3 text-[13px] leading-relaxed min-h-[100px] text-[#1A2332] resize-y w-full focus:outline-none focus:border-accent" rows="3" placeholder="Brief description of media coverage..."></textarea>
      </div>

      <!-- Actions -->
      <div class="mt-3 flex justify-end gap-2">
        <button @click="resetForm" class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7]" :disabled="submitting">Clear</button>
        <button @click="submitForReview" :disabled="submitting" class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 disabled:opacity-50">
          <i v-if="submitting" class="ti ti-loader-2 animate-spin text-sm"></i>
          {{ submitting ? 'Submitting…' : 'Submit for Review' }}
        </button>
      </div>
    </div>

    <!-- Events -->
    <div v-show="tab === 'events'">
      <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Upcoming PR Events</label>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
        <div class="flex items-center gap-2.5 px-3 py-[9px] border-b border-[#E1E4E9] text-xs"><input type="checkbox" class="accent-[#C41230] w-3.5 h-3.5 cursor-pointer"><span>Prepare press pack — Leadership Summit (Jun 10)</span></div>
        <div class="flex items-center gap-2.5 px-3 py-[9px] border-b border-[#E1E4E9] text-xs"><input type="checkbox" checked class="accent-[#C41230] w-3.5 h-3.5 cursor-pointer"><span class="line-through text-muted">Upload AGM cutouts to archive</span></div>
        <div class="flex items-center gap-2.5 px-3 py-[9px] border-b border-[#E1E4E9] text-xs"><input type="checkbox" class="accent-[#C41230] w-3.5 h-3.5 cursor-pointer"><span>Submit Q2 media performance report</span></div>
        <div class="flex items-center gap-2.5 px-3 py-[9px] text-xs"><input type="checkbox" class="accent-[#C41230] w-3.5 h-3.5 cursor-pointer"><span>Follow up on Channels TV feature — CapiPay</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api.js'

const tab = ref('log')

// ── Activity log data ─────────────────────────────────────────────────────────
const tasks       = ref([])
const loadingTasks = ref(false)

const totalFiles   = computed(() => tasks.value.reduce((sum, t) => sum + (t.attachments?.length ?? 0), 0))
const reviewCount  = computed(() => tasks.value.filter(t => t.status === 'review' || t.status === 'pending').length)
const approvedCount = computed(() => tasks.value.filter(t => t.status === 'completed').length)

async function loadTasks() {
  loadingTasks.value = true
  try {
    const all = await api.getTasks()
    tasks.value = all.filter(t => t.departmentName === 'PR & Media')
  } catch {
    // silently fail — table will stay empty
  } finally {
    loadingTasks.value = false
  }
}

onMounted(loadTasks)

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
  switch (status) {
    case 'completed':  return { label: 'Approved',    cls: 'bg-[#E6F7EF] text-success border-[#B6E6D0]' }
    case 'review':     return { label: 'Review',      cls: 'bg-[#FEF3E0] text-warn border-[#FAD999]' }
    case 'in_progress':return { label: 'In Progress', cls: 'bg-[#E8F0FB] text-info border-[#BACDF5]' }
    default:           return { label: 'Pending',     cls: 'bg-[#F4F5F7] text-muted border-[#E1E4E9]' }
  }
}

// ── Form state ────────────────────────────────────────────────────────────────
const eventName    = ref('')
const activityNotes = ref('')
const mediaLinks   = ref(['', ''])
const cutoutFiles  = ref([])
const kitFiles     = ref([])

// ── Drag state ────────────────────────────────────────────────────────────────
const isDraggingCutouts = ref(false)
const isDraggingKits    = ref(false)

// ── File input refs ───────────────────────────────────────────────────────────
const cutoutInput = ref(null)
const kitInput    = ref(null)

// ── Feedback ──────────────────────────────────────────────────────────────────
const submitting = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

// ── File helpers ──────────────────────────────────────────────────────────────
const MAX_SIZE = 10 * 1024 * 1024

function addCutouts(fileList) {
  errorMsg.value = ''
  for (const f of fileList) {
    if (f.size > MAX_SIZE) { errorMsg.value = `"${f.name}" exceeds the 10 MB limit.`; continue }
    cutoutFiles.value.push(f)
  }
}

function addKits(fileList) {
  errorMsg.value = ''
  for (const f of fileList) {
    if (f.size > MAX_SIZE) { errorMsg.value = `"${f.name}" exceeds the 10 MB limit.`; continue }
    kitFiles.value.push(f)
  }
}

function onPickCutouts(e) { addCutouts(e.target.files); e.target.value = '' }
function onPickKits(e)    { addKits(e.target.files);    e.target.value = '' }

function onDropCutouts(e) { isDraggingCutouts.value = false; addCutouts(e.dataTransfer.files) }
function onDropKits(e)    { isDraggingKits.value = false;    addKits(e.dataTransfer.files) }

// ── Reset ─────────────────────────────────────────────────────────────────────
function resetForm() {
  eventName.value     = ''
  activityNotes.value = ''
  mediaLinks.value    = ['', '']
  cutoutFiles.value   = []
  kitFiles.value      = []
  errorMsg.value      = ''
  successMsg.value    = ''
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function submitForReview() {
  successMsg.value = ''
  errorMsg.value   = ''

  if (!eventName.value.trim()) {
    errorMsg.value = 'Event / Campaign Name is required.'
    return
  }

  const allFiles = [...cutoutFiles.value, ...kitFiles.value]
  const validLinks = mediaLinks.value.map(l => l.trim()).filter(Boolean)

  // Build notes: include media links in the notes field
  const notesWithLinks = [
    activityNotes.value.trim(),
    validLinks.length ? 'Media links:\n' + validLinks.map(l => 'https://' + l).join('\n') : '',
  ].filter(Boolean).join('\n\n')

  const fd = new FormData()
  fd.append('title',          eventName.value.trim())
  fd.append('departmentName', 'PR & Media')
  fd.append('notes',          notesWithLinks)
  fd.append('priority',       'Medium')
  allFiles.forEach(f => fd.append('files', f))

  submitting.value = true
  try {
    await api.createTask(fd)
    successMsg.value = 'Submitted for review successfully!'
    resetForm()
    await loadTasks()
    tab.value = 'log'
  } catch (err) {
    errorMsg.value = err.message || 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
