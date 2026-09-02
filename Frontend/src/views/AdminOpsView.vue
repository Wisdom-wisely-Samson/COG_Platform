<template>
  <div>
    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Total Admin Tasks</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">{{ totalTasks }}</div>
        <div class="text-[11px] text-success mt-1">Current task volume</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Completed</div>
        <div class="text-[26px] font-semibold text-success leading-none">{{ completedTasks }}</div>
        <div class="text-[11px] text-muted mt-1">Tasks marked complete</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">In Review</div>
        <div class="text-[26px] font-semibold text-warn leading-none">{{ reviewTasks }}</div>
        <div class="text-[11px] text-muted mt-1">Awaiting approval</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Overdue</div>
        <div class="text-[26px] font-semibold text-accent leading-none">{{ overdueTasks }}</div>
        <div class="text-[11px] text-accent mt-1">Tasks past due</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Active Contributors</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">{{ activeUsers }}</div>
        <div class="text-[11px] text-muted mt-1">Unique contributors</div>
      </div>
    </div>

    <!-- Admin performance panels -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
        <div class="text-[13px] font-semibold mb-3.5">Status Breakdown</div>
        <div class="space-y-3">
          <div v-for="item in statusBreakdown" :key="item.key" class="flex items-center justify-between gap-3">
            <span class="text-[11px] text-[#1A2332]">{{ item.label }}</span>
            <span :class="item.class" class="text-[13px] font-semibold">{{ item.count }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
        <div class="text-[13px] font-semibold mb-3.5">Recent Admin Tasks</div>
        <div class="space-y-3">
          <div v-if="recentTasks.length === 0" class="text-[11px] text-muted">No recent tasks found.</div>
          <div v-for="task in recentTasks" :key="task._id" class="rounded-[10px] border border-[#E1E4E9] p-3">
            <div class="flex items-center justify-between gap-3">
              <div class="text-[12px] font-semibold text-[#1A2332] truncate">{{ task.title }}</div>
              <span :class="statusClass(task.status)" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">{{ task.status === 'review' ? 'Review' : task.status === 'in_progress' ? 'In Progress' : task.status === 'completed' ? 'Done' : 'Pending' }}</span>
            </div>
            <div class="text-[10px] text-muted mt-1">Due {{ formatDate(task.dueDate) }} · Priority {{ task.priority || 'Medium' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Checklist + Procurement -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="text-[13px] font-semibold mb-3.5">Operational Checklist</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
          <div v-for="item in checklist" :key="item.text"
               class="flex items-center gap-2.5 px-3 py-[9px] border-b border-[#E1E4E9] last:border-b-0 text-xs">
            <input type="checkbox" :checked="item.done" @change="item.done = !item.done" class="accent-[#FF6600] w-3.5 h-3.5 cursor-pointer">
            <span :class="item.done ? 'line-through text-muted' : ''">{{ item.text }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="text-[13px] font-semibold mb-3.5">Procurement Tracker</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Item</th>
                <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Vendor</th>
                <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
                <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in procurement" :key="p.item" class="hover:[&>td]:bg-[#F4F5F7]">
                <td class="px-3 py-2.5 border-b border-[#E1E4E9] last:border-b-0">{{ p.item }}</td>
                <td class="px-3 py-2.5 border-b border-[#E1E4E9] last:border-b-0">{{ p.vendor }}</td>
                <td class="px-3 py-2.5 border-b border-[#E1E4E9] last:border-b-0"><span :class="p.statusClass" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">{{ p.status }}</span></td>
                <td class="px-3 py-2.5 border-b border-[#E1E4E9] last:border-b-0">{{ p.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="mt-5">
      <div class="text-[13px] font-semibold mb-3.5">Operational Timeline — June 2025</div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
        <div v-for="(event, i) in timeline" :key="event.date"
             class="flex gap-3 items-start py-2"
             :class="i < timeline.length - 1 ? 'border-b border-[#E1E4E9]' : ''">
          <div class="w-[60px] text-[11px] text-muted flex-shrink-0 pt-0.5">{{ event.date }}</div>
          <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-[3px]" :style="{ background: event.dotColor }"></div>
          <div class="text-xs">{{ event.text }}
            <span v-if="event.tag" class="ml-1.5 text-[10px] px-2 py-[3px] rounded-full font-medium border" :class="event.tagClass">{{ event.tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { api } from '../api.js'

const tasks = ref([])
const loadingTasks = ref(false)

const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter((task) => task.status === 'completed').length)
const reviewTasks = computed(() => tasks.value.filter((task) => task.status === 'review' || task.status === 'pending').length)
const overdueTasks = computed(() => {
  const now = new Date()
  return tasks.value.filter((task) => task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now).length
})
const activeUsers = computed(() => {
  const ids = new Set()
  tasks.value.forEach((task) => {
    if (task.assignedTo?._id) ids.add(task.assignedTo._id)
    if (task.createdBy?._id) ids.add(task.createdBy._id)
  })
  return ids.size
})

const checklist = reactive([
  { text: 'Monthly payroll processing',            done: true  },
  { text: 'Vendor invoice reconciliation — May',   done: true  },
  { text: 'Facility maintenance scheduling — Jun', done: false },
  { text: 'Prepare Q2 expense report',             done: false },
  { text: 'Staff ID renewal batch — 8 employees',  done: true  },
  { text: 'Update IT asset register',              done: false },
])

const statusBreakdown = computed(() => {
  const counts = { pending: 0, in_progress: 0, review: 0, completed: 0 }
  tasks.value.forEach((task) => {
    if (counts[task.status] !== undefined) counts[task.status] += 1
  })
  return [
    { key: 'pending', label: 'Pending', count: counts.pending, class: 'text-muted' },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress, class: 'text-info' },
    { key: 'review', label: 'Review', count: counts.review, class: 'text-warn' },
    { key: 'completed', label: 'Completed', count: counts.completed, class: 'text-success' },
  ]
})

const dueThisWeek = computed(() => {
  const now = new Date()
  const end = new Date(now)
  end.setDate(now.getDate() + 7)
  return tasks.value.filter((task) => {
    if (!task.dueDate || task.status === 'completed') return false
    const due = new Date(task.dueDate)
    return due >= now && due <= end
  }).length
})

const recentTasks = computed(() =>
  tasks.value
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4),
)

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function statusClass(status) {
  return {
    pending: 'bg-[#F4F5F7] text-muted border-[#E1E4E9]',
    in_progress: 'bg-[#E4EDF9] text-info border-[#B8D0F0]',
    review: 'bg-[#FEF3E0] text-warn border-[#FAD999]',
    completed: 'bg-[#E6F7EF] text-success border-[#B6E6D0]',
  }[status] ?? 'bg-[#F4F5F7] text-muted border-[#E1E4E9]'
}

const procurement = [
  { item: 'Office Supplies', vendor: 'StationeryHub', status: 'Received', statusClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]', amount: '₦180K' },
  { item: 'IT Equipment',    vendor: 'TechZone Ltd',  status: 'Pending',  statusClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]',    amount: '₦1.2M' },
  { item: 'Event Furniture', vendor: 'FurniMax',      status: 'Received', statusClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]', amount: '₦450K' },
  { item: 'Branded Merch',   vendor: 'PrintPro NG',   status: 'Ordered',  statusClass: 'bg-[#E4EDF9] text-info border-[#B8D0F0]',    amount: '₦320K' },
]

const timeline = [
  { date: 'Jun 1',  dotColor: '#1A9E5C', text: 'Q2 budget review meeting — all HODs',  tag: 'Done',    tagClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]' },
  { date: 'Jun 5',  dotColor: '#E07A00', text: 'Vendor payment runs — batch 1',        tag: 'Pending', tagClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]'    },
  { date: 'Jun 10', dotColor: '#6B7896', text: 'Leadership Summit logistics briefing', tag: null,      tagClass: '' },
  { date: 'Jun 30', dotColor: '#6B7896', text: 'Q2 operations report submission',      tag: null,      tagClass: '' },
]

async function loadTasks() {
  loadingTasks.value = true
  try {
    const all = await api.getTasks()
    tasks.value = all.filter((task) => task.departmentName === 'Admin / Ops')
  } catch (err) {
    console.error('Failed to load Admin / Ops tasks:', err.message || err)
  } finally {
    loadingTasks.value = false
  }
}

onMounted(loadTasks)
</script>
