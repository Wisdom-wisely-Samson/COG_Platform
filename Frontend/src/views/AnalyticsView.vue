<template>
  <div>
    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Overall Completion</div>
        <div class="text-[26px] font-semibold text-success leading-none">{{ overallCompletion }}</div>
        <div class="text-[11px] text-success mt-1">Current task completion rate</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Top Dept</div>
        <div class="text-[16px] font-semibold text-accent leading-none">{{ topDepartment || 'N/A' }}</div>
        <div class="text-[11px] text-muted mt-1">Highest completion rate</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Activities Logged</div>
        <div class="text-[26px] font-semibold leading-none">{{ activitiesLogged }}</div>
        <div class="text-[11px] text-muted mt-1">Tasks recorded</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Avg Review Time</div>
        <div class="text-[26px] font-semibold leading-none">{{ averageReviewTime }}</div>
        <div class="text-[11px] text-muted mt-1">Approximate days in review</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
        <div class="text-[13px] font-semibold mb-3.5">Weekly Task Completion</div>
        <div class="flex items-end gap-1.5 h-[80px] mb-1.5">
          <div v-for="wk in weeklyBars" :key="wk.label" class="flex flex-col items-center gap-[3px] flex-1">
            <div class="rounded-t-[3px] w-full bg-[rgba(196,18,48,0.3)]" :style="{ height: wk.createdHeight + 'px' }"></div>
            <div class="rounded-t-[3px] w-full bg-accent" :style="{ height: wk.completedHeight + 'px' }"></div>
            <div class="text-[9px] text-muted text-center">{{ wk.label }}</div>
          </div>
        </div>
        <div class="flex gap-3 mt-2">
          <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-[rgba(196,18,48,0.3)]"></div>Created</div>
          <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-accent"></div>Completed</div>
        </div>
      </div>

      <div>
        <div class="text-[13px] font-semibold mb-3.5">Dept Completion Rate</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
          <div v-for="(d, i) in deptRates" :key="d.name" :class="i < deptRates.length - 1 ? 'mb-3' : ''">
            <div class="flex justify-between mb-1">
              <span class="text-xs font-medium">{{ d.name }}</span>
              <span class="text-xs font-semibold" :class="d.valueClass">{{ d.value }}</span>
            </div>
            <div class="h-2 bg-[#E1E4E9] rounded-full overflow-hidden">
              <div class="h-full rounded-full progress-fill" :style="{ width: d.value, background: d.color }"></div>
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

const tasks = ref([])
const loading = ref(false)

const completedTasks = computed(() => tasks.value.filter((task) => task.status === 'completed').length)
const overallCompletion = computed(() => {
  if (!tasks.value.length) return '0%'
  return `${Math.round((completedTasks.value / tasks.value.length) * 100)}%`
})
const topDepartment = computed(() => {
  const deptStats = tasks.value.reduce((acc, task) => {
    const dept = task.departmentName || 'Other'
    acc[dept] = acc[dept] || { completed: 0, total: 0 }
    acc[dept].total += 1
    if (task.status === 'completed') acc[dept].completed += 1
    return acc
  }, {})

  const sorted = Object.entries(deptStats)
    .map(([name, stats]) => ({ name, rate: stats.total ? stats.completed / stats.total : 0 }))
    .sort((a, b) => b.rate - a.rate)

  return sorted[0]?.name || ''
})
const activitiesLogged = computed(() => tasks.value.length)
const averageReviewTime = computed(() => {
  const reviewTasks = tasks.value.filter((task) => task.status === 'review' || task.status === 'pending')
  if (!reviewTasks.length) return '—'
  const totalDays = reviewTasks.reduce((sum, task) => {
    if (!task.createdAt) return sum
    const created = new Date(task.createdAt)
    return sum + Math.max(0, (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
  }, 0)
  return `${Math.round(totalDays / reviewTasks.length)}d`
})

const weeklyBars = computed(() => {
  const now = new Date()
  return Array.from({ length: 4 }, (_, index) => {
    const start = new Date(now)
    start.setDate(now.getDate() - (3 - index) * 7)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    const createdCount = tasks.value.filter((task) => {
      const created = task.createdAt ? new Date(task.createdAt) : null
      return created && created >= start && created <= end
    }).length
    const completedCount = tasks.value.filter((task) => {
      const created = task.createdAt ? new Date(task.createdAt) : null
      return task.status === 'completed' && created && created >= start && created <= end
    }).length

    return {
      label: `Wk ${index + 1}`,
      createdHeight: Math.min(72, Math.max(12, createdCount * 10)),
      completedHeight: Math.min(72, Math.max(12, completedCount * 10)),
    }
  })
})

const deptRates = computed(() => {
  const departments = ['Admin / Ops', 'PR & Media', 'Creative', 'Digital']
  const counts = departments.map((dept) => {
    const deptTasks = tasks.value.filter((task) => task.departmentName === dept)
    const completed = deptTasks.filter((task) => task.status === 'completed').length
    const rate = deptTasks.length ? Math.round((completed / deptTasks.length) * 100) : 0
    return {
      name: dept,
      value: `${rate}%`,
      color:
        dept === 'Admin / Ops' ? '#E07A00' :
        dept === 'PR & Media' ? '#FF6600' :
        dept === 'Creative' ? '#2E7D32' : '#1C5FAD',
      valueClass: rate >= 80 ? 'text-success' : '',
    }
  })
  return counts
})

async function loadTasks() {
  loading.value = true
  try {
    tasks.value = await api.getTasks()
  } catch (error) {
    console.error('Failed to load analytics tasks:', error.message || error)
  } finally {
    loading.value = false
  }
}

onMounted(loadTasks)
</script>
