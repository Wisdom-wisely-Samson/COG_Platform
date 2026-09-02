<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="text-[13px] font-semibold">All Department Tasks</div>
      <div class="flex gap-2">
        <button class="inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7]">
          <i class="ti ti-filter text-[15px]"></i>Filter
        </button>
        <button @click="$emit('open-modal')"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90">
          <i class="ti ti-plus text-[15px]"></i>Assign Task
        </button>
      </div>
    </div>

    <!-- Task table -->
    <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
      <table class="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Task</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Department</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Assigned To</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Due</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Priority</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
            <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">AI Report</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-3 py-8 text-center text-muted text-[12px]">
              <i class="ti ti-loader-2 animate-spin text-base mr-1.5"></i>Loading tasks…
            </td>
          </tr>
          <tr v-else-if="tasks.length === 0">
            <td colspan="7" class="px-3 py-8 text-center text-muted text-[12px]">No tasks found.</td>
          </tr>
          <tr v-else v-for="t in tasks" :key="t._id" class="hover:[&>td]:bg-[#F9FAFB]">
            <td class="px-3 py-2.5 border-b border-[#E1E4E9] max-w-[220px]">
              <div class="font-medium text-[#1A2332] truncate">{{ t.title }}</div>
              <div v-if="t.attachments?.length" class="text-[10px] text-muted mt-0.5">
                <i class="ti ti-paperclip text-[10px]"></i> {{ t.attachments.length }} file{{ t.attachments.length > 1 ? 's' : '' }}
              </div>
            </td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">
              <span :class="deptClass(t.departmentName)" class="font-medium">{{ t.departmentName || '—' }}</span>
            </td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9] text-muted">{{ t.assignedTo?.fullName || '—' }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9] text-muted">{{ formatDate(t.dueDate) }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">
              <span :class="priorityClass(t.priority)" class="font-medium">{{ t.priority }}</span>
            </td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">
              <span :class="statusClass(t.status)" class="text-[10px] px-2 py-0.75 rounded-full font-medium border">{{ statusLabel(t.status) }}</span>
            </td>
            <!-- AI Report button -->
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">
              <button @click="openEvaluate(t)"
                      title="Generate an AI report for this task"
                      class="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-accent text-white text-[10px] font-semibold hover:bg-[#0057a8] transition-colors cursor-pointer">
                <i class="ti ti-robot text-[12px]"></i>Generate Report
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== AI REPORT MODAL ===== -->
    <div v-if="evalModal.open" @click.self="closeEvaluate"
         class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[14px] w-full max-w-[560px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#E1E4E9] flex items-start justify-between shrink-0">
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <i class="ti ti-robot text-accent text-[15px]"></i>
              <span class="text-[13px] font-semibold">AI Report</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded bg-[#0D2B4F] text-white font-medium">Claude AI</span>
            </div>
            <div class="text-[11px] text-muted truncate max-w-[380px]">{{ evalModal.task?.title }}</div>
          </div>
          <button @click="closeEvaluate" class="bg-transparent border-none cursor-pointer text-muted text-lg hover:text-[#1A2332] leading-none ml-4">✕</button>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto flex-1 p-6">

          <!-- Loading state -->
          <div v-if="evalModal.loading" class="flex flex-col items-center justify-center py-12 gap-4">
            <div class="w-14 h-14 rounded-full border-4 border-[#E1E4E9] border-t-accent animate-spin"></div>
            <div class="text-[13px] font-medium text-[#1A2332]">Generating AI report...</div>
            <div class="text-[11px] text-muted text-center max-w-[280px]">
              Claude AI is creating a stakeholder report summary for {{ evalModal.task?.departmentName || 'this department' }}.
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="evalModal.error"
               class="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div class="w-12 h-12 rounded-full bg-[#FDE8EC] flex items-center justify-center">
              <i class="ti ti-alert-triangle text-accent text-[22px]"></i>
            </div>
            <div class="text-[13px] font-semibold">Report Generation Failed</div>
            <div class="text-[12px] text-muted max-w-[340px]">{{ evalModal.error }}</div>
            <button @click="runEvaluate"
                    class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent text-white text-[12px] cursor-pointer hover:opacity-90 border border-accent">
              <i class="ti ti-refresh text-[13px]"></i>Try Again
            </button>
          </div>

          <!-- Results -->
          <div v-else-if="evalModal.result">
            <!-- Score + grade row -->
            <div class="flex items-center gap-5 mb-5">
              <!-- Score ring -->
              <div class="relative shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#F4F5F7" stroke-width="8"/>
                  <circle cx="40" cy="40" r="34" fill="none"
                          :stroke="scoreColor(evalModal.result.score)"
                          stroke-width="8"
                          stroke-linecap="round"
                          :stroke-dasharray="`${(evalModal.result.score / 100) * 213.6} 213.6`"
                          transform="rotate(-90 40 40)"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div class="text-[20px] font-bold leading-none" :style="{ color: scoreColor(evalModal.result.score) }">
                    {{ evalModal.result.score }}
                  </div>
                  <div class="text-[9px] text-muted">/100</div>
                </div>
              </div>

              <!-- Grade + dept + recommendation -->
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="text-[28px] font-bold leading-none" :style="{ color: scoreColor(evalModal.result.score) }">
                    {{ evalModal.result.grade }}
                  </span>
                  <span :class="deptClass(evalModal.task?.departmentName)"
                        class="text-[10px] font-semibold px-2 py-0.75 rounded-full border border-current/30 bg-current/5">
                    {{ evalModal.task?.departmentName }}
                  </span>
                </div>
                <span :class="recClass(evalModal.result.recommendation)"
                      class="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border">
                  <i :class="recIcon(evalModal.result.recommendation)" class="text-[11px]"></i>
                  {{ evalModal.result.recommendation }}
                </span>
              </div>
            </div>

            <!-- Summary -->
            <p class="text-[12px] text-[#1A2332] leading-relaxed bg-[#F9FAFB] border border-[#E1E4E9] rounded-lg px-4 py-3 mb-5">
              {{ evalModal.result.summary }}
            </p>

            <!-- Criteria bars -->
            <div class="mb-5">
              <div class="text-[10px] font-semibold uppercase tracking-wider text-muted mb-3">Report Criteria</div>
              <div class="space-y-3">
                <div v-for="c in evalModal.result.criteria" :key="c.name">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-medium text-[#1A2332]">{{ c.name }}</span>
                    <span class="text-[11px] font-semibold" :style="{ color: scoreColor((c.score / c.maxScore) * 100) }">
                      {{ c.score }}/{{ c.maxScore }}
                    </span>
                  </div>
                  <div class="h-1.5 bg-[#F4F5F7] rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700"
                         :style="{ width: `${(c.score / c.maxScore) * 100}%`, background: scoreColor((c.score / c.maxScore) * 100) }">
                    </div>
                  </div>
                  <div class="text-[10px] text-muted mt-0.5">{{ c.feedback }}</div>
                </div>
              </div>
            </div>

            <!-- Strengths + improvements -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-[#F0FBF4] border border-[#B6E6D0] rounded-lg p-3">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-success mb-2">
                  <i class="ti ti-circle-check mr-1"></i>Strengths
                </div>
                <ul class="space-y-1">
                  <li v-for="s in evalModal.result.strengths" :key="s"
                      class="text-[11px] text-[#1A2332] flex items-start gap-1.5">
                    <i class="ti ti-check text-success text-[11px] mt-[1px] shrink-0"></i>{{ s }}
                  </li>
                </ul>
              </div>
              <div class="bg-[#FFFBF0] border border-[#FAD999] rounded-lg p-3">
                <div class="text-[10px] font-semibold uppercase tracking-wider text-warn mb-2">
                  <i class="ti ti-alert-circle mr-1"></i>Improvements
                </div>
                <ul class="space-y-1">
                  <li v-for="imp in evalModal.result.improvements" :key="imp"
                      class="text-[11px] text-[#1A2332] flex items-start gap-1.5">
                    <i class="ti ti-arrow-right text-warn text-[11px] mt-[1px] shrink-0"></i>{{ imp }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div v-if="!evalModal.loading && evalModal.result"
             class="px-6 py-3 border-t border-[#E1E4E9] bg-[#F9FAFB] shrink-0 flex items-center justify-between">
          <span class="text-[10px] text-muted">
            <i class="ti ti-robot text-[10px]"></i>
            Powered by Claude AI · Auto report generation support
          </span>
          <button @click="runEvaluate"
                  class="inline-flex items-center gap-1 px-3 py-[5px] rounded-md border border-[#E1E4E9] bg-white text-[11px] text-muted hover:bg-[#F4F5F7] cursor-pointer">
            <i class="ti ti-refresh text-[12px]"></i>Regenerate Report
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api.js'

defineEmits(['open-modal'])

// ── Tasks ─────────────────────────────────────────────────────────────────────
const tasks   = ref([])
const loading = ref(false)

async function loadTasks() {
  loading.value = true
  try {
    tasks.value = await api.getTasks()
  } catch (e) {
    console.error('Failed to load tasks:', e.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadTasks)

// ── Formatters ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function deptClass(dept) {
  return {
    'PR & Media':  'text-accent',
    'Digital':     'text-info',
    'Creative':    'text-[#2E7D32]',
    'Admin / Ops': 'text-warn',
    'Admin / Operations': 'text-warn',
  }[dept] ?? 'text-muted'
}

function priorityClass(p) {
  return { High: 'text-accent', Medium: 'text-warn', Low: 'text-success' }[p] ?? 'text-muted'
}

function statusLabel(s) {
  return { pending: 'Pending', in_progress: 'In Progress', review: 'Review', completed: 'Done' }[s] ?? s
}

function statusClass(s) {
  return {
    pending:     'bg-[#F4F5F7] text-muted border-[#E1E4E9]',
    in_progress: 'bg-[#E4EDF9] text-info border-[#B8D0F0]',
    review:      'bg-[#FEF3E0] text-warn border-[#FAD999]',
    completed:   'bg-[#E6F7EF] text-success border-[#B6E6D0]',
  }[s] ?? 'bg-[#F4F5F7] text-muted border-[#E1E4E9]'
}

// ── AI Report ─────────────────────────────────────────────────────────────────
const evalModal = ref({ open: false, task: null, loading: false, result: null, error: '' })

function openEvaluate(task) {
  evalModal.value = { open: true, task, loading: false, result: null, error: '' }
  runEvaluate()
}

function closeEvaluate() {
  evalModal.value.open = false
}

async function runEvaluate() {
  evalModal.value.loading = true
  evalModal.value.result  = null
  evalModal.value.error   = ''
  try {
    const res = await api.generateReport(evalModal.value.task._id)
    evalModal.value.result = res.evaluation
  } catch (e) {
    evalModal.value.error = e.message || 'Report generation failed. Please try again.'
  } finally {
    evalModal.value.loading = false
  }
}

function scoreColor(score) {
  if (score >= 80) return '#2E7D32'   // green
  if (score >= 60) return '#E07A00'   // amber
  return '#FF6600'                    // red
}

function recClass(rec) {
  return {
    'Approved':          'bg-[#E6F7EF] text-success border-[#B6E6D0]',
    'Needs Revision':    'bg-[#FEF3E0] text-warn border-[#FAD999]',
    'Not Recommended':   'bg-[#FDE8EC] text-accent border-[#F5C0CB]',
  }[rec] ?? 'bg-[#F4F5F7] text-muted border-[#E1E4E9]'
}

function recIcon(rec) {
  return {
    'Approved':        'ti ti-circle-check',
    'Needs Revision':  'ti ti-edit',
    'Not Recommended': 'ti ti-circle-x',
  }[rec] ?? 'ti ti-info-circle'
}
</script>
