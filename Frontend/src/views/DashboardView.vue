<template>
  <div>
    <!-- Stat Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Total Tasks</div>
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
        <div class="text-[11px] text-accent mt-1">Tasks past due date</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Active Users</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">{{ activeUsers }}</div>
        <div class="text-[11px] text-muted mt-1">Unique contributors</div>
      </div>
    </div>

    <!-- Dept Cards -->
    <div class="flex items-center justify-between mb-3.5">
      <div class="text-[13px] font-semibold">Department Performance</div>
      <div @click="$emit('navigate', 'analytics')" class="text-xs text-info cursor-pointer">View analytics →</div>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5 mb-6">
      <div v-for="dept in departmentSummaries" :key="dept.name"
           @click="$emit('navigate', dept.route)"
           class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-accent/30 hover:shadow-md hover:-translate-y-px">
        <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
          <div :class="['w-[34px] h-[34px] rounded-lg flex items-center justify-center text-base', dept.iconBg, dept.iconText]">
            <i :class="['ti', dept.icon]"></i>
          </div>
          <div>
            <div class="text-[13px] font-semibold">{{ dept.name }}</div>
            <div class="text-[11px] text-muted mt-px">{{ dept.members }} members · {{ dept.pending }} pending</div>
          </div>
          <div class="ml-auto"><span class="inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full font-medium" :class="dept.badgeClass">{{ dept.badge }}</span></div>
        </div>
        <div class="px-4 py-3.5">
          <div class="mb-2.5">
            <div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Task completion</span><span class="text-[11px] font-medium">{{ dept.completionRate }}</span></div>
            <div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full" :style="{ width: dept.completionRate, background: dept.barColor }"></div></div>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border" :class="dept.badgeClass">{{ dept.badge }}</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#F4F5F7] text-muted border-[#E1E4E9]">{{ dept.note }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart + Activity Feed -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="text-[13px] font-semibold mb-3.5">Output vs Completion by Dept</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
          <div class="flex items-end gap-1.5 h-[80px] mb-1.5">
            <div v-for="bar in weeklyBars" :key="bar.label" class="flex flex-col items-center gap-[3px] flex-1">
              <div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-accent" :style="{ height: bar.height + 'px' }"></div>
              <div class="text-[9px] text-muted text-center">{{ bar.label }}</div>
            </div>
          </div>
          <div class="flex gap-3 mt-2">
            <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-[#D1C0C2]"></div>Tasks created</div>
            <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-accent"></div>Workload trend</div>
          </div>
        </div>
      </div>
      <div>
        <div class="text-[13px] font-semibold mb-3.5">Recent Activity</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
          <div v-if="recentActivity.length === 0" class="py-12 px-4 text-center text-muted text-xs">
            No recent task activity yet. The dashboard will reflect submissions as they are created.
          </div>
          <div v-else>
            <div v-for="item in recentActivity" :key="item._id" class="flex items-start gap-3 px-4 py-3 border-b border-[#E1E4E9] last:border-b-0 hover:bg-[#F4F5F7] transition-colors">
              <div class="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0 mt-px"
                   :style="{ background: item.color }">{{ item.initials }}</div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold mb-px">{{ item.name }} <span class="text-muted font-normal">· {{ item.dept }}</span></div>
                <div class="text-xs text-muted leading-snug">{{ item.text }}</div>
                <span class="inline-block mt-1 px-2 py-[2px] rounded-full text-[10px] font-medium" :class="item.statusClass">{{ item.status }}</span>
              </div>
              <div class="text-[11px] text-muted whitespace-nowrap mt-0.5">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api.js'

defineEmits(['navigate', 'open-modal'])

const tasks = ref([])

const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(
  () => tasks.value.filter((task) => task.status === 'completed').length,
)
const reviewTasks = computed(
  () => tasks.value.filter((task) => task.status === 'review' || task.status === 'pending').length,
)
const overdueTasks = computed(() => {
  const now = new Date()
  return tasks.value.filter(
    (task) => task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < now,
  ).length
})
const activeUsers = computed(() => {
  const ids = new Set()
  tasks.value.forEach((task) => {
    if (task.assignedTo?._id) ids.add(task.assignedTo._id)
    if (task.createdBy?._id) ids.add(task.createdBy._id)
  })
  return ids.size
})

const departmentSummaries = computed(() => {
  const departments = [
    {
      name: 'PR & Media',
      route: 'pr',
      icon: 'ti-speakerphone',
      iconBg: 'bg-[#FDE8EC]',
      iconText: 'text-accent',
      barColor: '#FF6600',
      badgeClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]',
      badge: 'Active',
      note: 'PR deliverables',
    },
    {
      name: 'Digital',
      route: 'digital',
      icon: 'ti-brand-instagram',
      iconBg: 'bg-[#E4EDF9]',
      iconText: 'text-info',
      barColor: '#1C5FAD',
      badgeClass: 'bg-[#E4EDF9] text-info border-[#B8D0F0]',
      badge: 'Active',
      note: 'Digital campaigns',
    },
    {
      name: 'Creative',
      route: 'creative',
      icon: 'ti-palette',
      iconBg: 'bg-[#EFF6E8]',
      iconText: 'text-[#2E7D32]',
      barColor: '#2E7D32',
      badgeClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]',
      badge: 'Active',
      note: 'Creative assets',
    },
    {
      name: 'Admin / Ops',
      route: 'admin',
      icon: 'ti-briefcase',
      iconBg: 'bg-[#FEF3E0]',
      iconText: 'text-warn',
      barColor: '#E07A00',
      badgeClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]',
      badge: 'Active',
      note: 'Operational tasks',
    },
  ]

  return departments.map((dept) => {
    const deptTasks = tasks.value.filter((task) => task.departmentName === dept.name)
    const completed = deptTasks.filter((task) => task.status === 'completed').length
    const pending = deptTasks.filter(
      (task) => task.status === 'review' || task.status === 'pending',
    ).length
    const members =
      Array.from(
        new Set(
          deptTasks.flatMap((task) => [task.assignedTo?._id, task.createdBy?._id].filter(Boolean)),
        ),
      ).length || 1
    const completionRate = deptTasks.length
      ? `${Math.round((completed / deptTasks.length) * 100)}%`
      : '0%'
    return {
      ...dept,
      tasks: deptTasks.length,
      pending,
      members,
      completionRate,
    }
  })
})

const weeklyBars = computed(() => {
  const now = new Date()
  const days = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (3 - i) * 7)
    return date
  })

  return days.map((date, i) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    const count = tasks.value.filter((task) => {
      const created = task.createdAt ? new Date(task.createdAt) : null
      return created && created >= start && created <= end
    }).length

    return {
      label: `Wk ${i + 1}`,
      height: Math.min(76, Math.max(12, count * 10)),
      count,
    }
  })
})

const recentActivity = computed(() => {
  return tasks.value
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((task) => {
      const initials = (task.createdBy?.fullName || 'Team')
        .split(' ')
        .map((word) => word[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('')
      const dept = task.departmentName || 'General'
      const status =
        task.status === 'completed'
          ? 'Approved'
          : task.status === 'review'
          ? 'In Review'
          : task.status === 'in_progress'
          ? 'In Progress'
          : 'Pending'
      const statusClass =
        task.status === 'completed'
          ? 'bg-[#E6F7EF] text-success border-[#B6E6D0]'
          : task.status === 'review'
          ? 'bg-[#FEF3E0] text-warn border-[#FAD999]'
          : task.status === 'in_progress'
          ? 'bg-[#E8F0FB] text-info border-[#BACDF5]'
          : 'bg-[#F4F5F7] text-muted border-[#E1E4E9]'
      return {
        _id: task._id,
        initials,
        color: activityColor(dept),
        name: task.createdBy?.fullName || 'Team member',
        dept,
        text: task.title || 'Task update submitted.',
        status,
        statusClass,
        time: formatRelative(task.createdAt),
      }
    })
})

function activityColor(dept) {
  return {
    'PR & Media': '#FF6600',
    Digital: '#1C5FAD',
    Creative: '#2E7D32',
    'Admin / Ops': '#E07A00',
  }[dept] ?? '#6B7896'
}

function formatRelative(iso) {
  if (!iso) return 'Unknown'
  const diff = Math.max(0, Date.now() - new Date(iso))
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

async function loadTasks() {
  try {
    tasks.value = await api.getTasks()
  } catch (error) {
    console.error('Failed to load dashboard tasks:', error.message)
  }
}

onMounted(loadTasks)
</script>
