<template>
  <div>
    <!-- KPI Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Overall Completion</div>
        <div class="text-[26px] font-semibold text-success leading-none">62%</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Top Dept</div>
        <div class="text-[16px] font-semibold text-accent leading-none">Admin</div>
        <div class="text-[11px] text-muted mt-1">88% completion</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Activities Logged</div>
        <div class="text-[26px] font-semibold leading-none">318</div>
        <div class="text-[11px] text-muted mt-1">This month</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Avg Review Time</div>
        <div class="text-[26px] font-semibold leading-none">1.4d</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-4">
        <div class="text-[13px] font-semibold mb-3.5">Weekly Task Completion</div>
        <div class="flex items-end gap-1.5 h-[80px] mb-1.5">
          <div v-for="wk in weeklyBars" :key="wk.label" class="flex flex-col items-center gap-[3px] flex-1">
            <div class="rounded-t-[3px] w-full bg-[rgba(196,18,48,0.3)]" :style="{ height: wk.assigned + 'px' }"></div>
            <div class="rounded-t-[3px] w-full bg-accent" :style="{ height: wk.completed + 'px' }"></div>
            <div class="text-[9px] text-muted text-center">{{ wk.label }}</div>
          </div>
        </div>
        <div class="flex gap-3 mt-2">
          <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-[rgba(196,18,48,0.3)]"></div>Assigned</div>
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
const weeklyBars = [
  { label: 'Wk1', assigned: 44, completed: 34 },
  { label: 'Wk2', assigned: 58, completed: 49 },
  { label: 'Wk3', assigned: 66, completed: 52 },
  { label: 'Wk4', assigned: 72, completed: 60 },
]

const deptRates = [
  { name: 'Admin / Ops', value: '88%', color: '#E07A00', valueClass: 'text-success' },
  { name: 'PR & Media',  value: '78%', color: '#C41230', valueClass: ''             },
  { name: 'Creative',    value: '82%', color: '#2E7D32', valueClass: ''             },
  { name: 'Digital',     value: '70%', color: '#1C5FAD', valueClass: ''             },
]
</script>
