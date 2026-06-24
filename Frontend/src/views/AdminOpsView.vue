<template>
  <div>
    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4"><div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Tasks Complete</div><div class="text-[26px] font-semibold text-success leading-none">22</div></div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4"><div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Pending</div><div class="text-[26px] font-semibold text-warn leading-none">3</div></div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4"><div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Vendors Active</div><div class="text-[26px] font-semibold leading-none">14</div></div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4"><div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Budget Used</div><div class="text-[26px] font-semibold leading-none">73%</div></div>
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
import { reactive } from 'vue'

const checklist = reactive([
  { text: 'Monthly payroll processing',            done: true  },
  { text: 'Vendor invoice reconciliation — May',   done: true  },
  { text: 'Facility maintenance scheduling — Jun', done: false },
  { text: 'Prepare Q2 expense report',             done: false },
  { text: 'Staff ID renewal batch — 8 employees',  done: true  },
  { text: 'Update IT asset register',              done: false },
])

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
</script>
