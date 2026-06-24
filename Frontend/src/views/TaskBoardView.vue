<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="text-[13px] font-semibold">All Department Tasks</div>
      <div class="flex gap-2">
        <button class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7]">
          <i class="ti ti-filter text-[15px]"></i>Filter
        </button>
        <button @click="$emit('open-modal')"
                class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90">
          <i class="ti ti-plus text-[15px]"></i>Assign Task
        </button>
      </div>
    </div>

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.title" class="hover:[&>td]:bg-[#F4F5F7]">
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">{{ task.title }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]"><span :class="task.deptClass" class="font-medium">{{ task.dept }}</span></td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">{{ task.assignee }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]">{{ task.due }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]" :class="task.priorityClass">{{ task.priority }}</td>
            <td class="px-3 py-2.5 border-b border-[#E1E4E9]"><span :class="task.statusClass" class="text-[10px] px-2 py-[3px] rounded-full font-medium border">{{ task.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineEmits(['open-modal'])

const tasks = [
  { title: 'Vanguard press clippings upload',     dept: 'PR',       deptClass: 'text-accent',    assignee: 'Amara Nwosu',   due: 'Today', priority: 'High',   priorityClass: 'text-accent font-medium',  status: 'Review', statusClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]'    },
  { title: 'June social media calendar copy',     dept: 'Digital',  deptClass: 'text-info',      assignee: 'Kemi Obi',      due: 'Jun 5', priority: 'High',   priorityClass: 'text-accent font-medium',  status: 'Draft',  statusClass: 'bg-[#E4EDF9] text-info border-[#B8D0F0]'    },
  { title: 'Brand identity poster series (6 pcs)', dept: 'Creative', deptClass: 'text-[#2E7D32]', assignee: 'Tunde Makinde', due: 'Jun 7', priority: 'Medium', priorityClass: 'text-warn font-medium',    status: 'Done',   statusClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]' },
  { title: 'Q2 vendor procurement list',          dept: 'Admin',    deptClass: 'text-warn',      assignee: 'Funmi Adeola',  due: 'Jun 4', priority: 'Low',    priorityClass: 'text-success font-medium', status: 'Done',   statusClass: 'bg-[#E6F7EF] text-success border-[#B6E6D0]' },
  { title: 'Media kit — Annual General Meeting',  dept: 'PR',       deptClass: 'text-accent',    assignee: 'Chisom Eze',    due: 'Jun 8', priority: 'High',   priorityClass: 'text-accent font-medium',  status: 'Review', statusClass: 'bg-[#FEF3E0] text-warn border-[#FAD999]'    },
  { title: 'Instagram reel motion graphic',       dept: 'Creative', deptClass: 'text-[#2E7D32]', assignee: 'Osas Idehen',   due: 'Jun 6', priority: 'Medium', priorityClass: 'text-warn font-medium',    status: 'Draft',  statusClass: 'bg-[#E4EDF9] text-info border-[#B8D0F0]'    },
  { title: 'Digital brief — product launch',      dept: 'Digital',  deptClass: 'text-info',      assignee: 'Bayo Adeyemi',  due: 'Jun 9', priority: 'Medium', priorityClass: 'text-warn font-medium',    status: 'Draft',  statusClass: 'bg-[#E4EDF9] text-info border-[#B8D0F0]'    },
]
</script>
