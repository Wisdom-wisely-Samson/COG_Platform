<template>
  <div>
    <!-- Stat Cards -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Total Tasks</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">142</div>
        <div class="text-[11px] text-success mt-1">↑ 12 this week</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Completed</div>
        <div class="text-[26px] font-semibold text-success leading-none">89</div>
        <div class="text-[11px] text-muted mt-1">62.6% completion rate</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">In Review</div>
        <div class="text-[26px] font-semibold text-warn leading-none">27</div>
        <div class="text-[11px] text-muted mt-1">Awaiting approval</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Overdue</div>
        <div class="text-[26px] font-semibold text-accent leading-none">8</div>
        <div class="text-[11px] text-accent mt-1">↑ 3 from last week</div>
      </div>
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] p-3.5 px-4">
        <div class="text-[11px] text-muted font-medium uppercase tracking-[0.04em] mb-1.5">Active Users</div>
        <div class="text-[26px] font-semibold text-[#1A2332] leading-none">34</div>
        <div class="text-[11px] text-muted mt-1">Across 4 departments</div>
      </div>
    </div>

    <!-- Dept Cards -->
    <div class="flex items-center justify-between mb-3.5">
      <div class="text-[13px] font-semibold">Department Performance</div>
      <div @click="$emit('navigate', 'reports')" class="text-xs text-info cursor-pointer">View analytics →</div>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5 mb-6">

      <!-- PR -->
      <div @click="$emit('navigate', 'pr')"
           class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-accent/30 hover:shadow-md hover:-translate-y-px">
        <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
          <div class="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-base bg-[#FDE8EC] text-accent"><i class="ti ti-speakerphone"></i></div>
          <div><div class="text-[13px] font-semibold">PR &amp; Media</div><div class="text-[11px] text-muted mt-px">8 members · 3 pending</div></div>
          <div class="ml-auto"><span class="inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full font-medium bg-[#FEF3E0] text-warn"><span class="w-[5px] h-[5px] rounded-full bg-warn"></span>Active</span></div>
        </div>
        <div class="px-4 py-3.5">
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Weekly deliverables</span><span class="text-[11px] font-medium">14/18</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-accent progress-fill" style="width:78%"></div></div></div>
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Media coverage</span><span class="text-[11px] font-medium">92%</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-success progress-fill" style="width:92%"></div></div></div>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E6F7EF] text-success border-[#B6E6D0]">Newspaper Cutouts</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E4EDF9] text-info border-[#B8D0F0]">Media Links</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#FEF3E0] text-warn border-[#FAD999]">3 In Review</span>
          </div>
        </div>
      </div>

      <!-- Digital -->
      <div @click="$emit('navigate', 'digital')"
           class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-accent/30 hover:shadow-md hover:-translate-y-px">
        <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
          <div class="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-base bg-[#E4EDF9] text-info"><i class="ti ti-brand-instagram"></i></div>
          <div><div class="text-[13px] font-semibold">Digital</div><div class="text-[11px] text-muted mt-px">6 members · 5 pending</div></div>
          <div class="ml-auto"><span class="inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full font-medium bg-[#E4EDF9] text-info"><span class="w-[5px] h-[5px] rounded-full bg-info"></span>Active</span></div>
        </div>
        <div class="px-4 py-3.5">
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Social campaigns</span><span class="text-[11px] font-medium">7/10</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-info progress-fill" style="width:70%"></div></div></div>
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Content calendar</span><span class="text-[11px] font-medium">85%</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-success progress-fill" style="width:85%"></div></div></div>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E4EDF9] text-info border-[#B8D0F0]">Digital Briefs</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E6F7EF] text-success border-[#B6E6D0]">Copy Ready</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#FEF3E0] text-warn border-[#FAD999]">5 Drafts</span>
          </div>
        </div>
      </div>

      <!-- Creative -->
      <div @click="$emit('navigate', 'creative')"
           class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-accent/30 hover:shadow-md hover:-translate-y-px">
        <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
          <div class="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-base bg-[#EFF6E8] text-[#2E7D32]"><i class="ti ti-palette"></i></div>
          <div><div class="text-[13px] font-semibold">Creative</div><div class="text-[11px] text-muted mt-px">10 members · 8 assets</div></div>
          <div class="ml-auto"><span class="inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full font-medium bg-[#E6F7EF] text-success"><span class="w-[5px] h-[5px] rounded-full bg-[#2E7D32]"></span>Active</span></div>
        </div>
        <div class="px-4 py-3.5">
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Design assets</span><span class="text-[11px] font-medium">31/38</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-[#2E7D32] progress-fill" style="width:82%"></div></div></div>
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Video/GIF production</span><span class="text-[11px] font-medium">60%</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-warn progress-fill" style="width:60%"></div></div></div>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E6F7EF] text-success border-[#B6E6D0]">Still Artworks</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E4EDF9] text-info border-[#B8D0F0]">Videos/GIFs</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#FDE8EC] text-accent border-[#F5C0CB]">2 Revisions</span>
          </div>
        </div>
      </div>

      <!-- Admin -->
      <div @click="$emit('navigate', 'admin')"
           class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:border-accent/30 hover:shadow-md hover:-translate-y-px">
        <div class="px-4 py-3.5 flex items-center gap-2.5 border-b border-[#E1E4E9]">
          <div class="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-base bg-[#FEF3E0] text-warn"><i class="ti ti-briefcase"></i></div>
          <div><div class="text-[13px] font-semibold">Admin / Ops</div><div class="text-[11px] text-muted mt-px">5 members · 2 pending</div></div>
          <div class="ml-auto"><span class="inline-flex items-center gap-1 text-[10px] px-2 py-[3px] rounded-full font-medium bg-[#FEF3E0] text-warn"><span class="w-[5px] h-[5px] rounded-full bg-warn"></span>Active</span></div>
        </div>
        <div class="px-4 py-3.5">
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Operational tasks</span><span class="text-[11px] font-medium">22/25</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-warn progress-fill" style="width:88%"></div></div></div>
          <div class="mb-2.5"><div class="flex justify-between mb-1"><span class="text-[11px] text-muted">Procurement</span><span class="text-[11px] font-medium">95%</span></div><div class="h-[5px] bg-[#E1E4E9] rounded-full overflow-hidden"><div class="h-full rounded-full bg-success progress-fill" style="width:95%"></div></div></div>
          <div class="flex flex-wrap gap-1.5 mt-2.5">
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#E6F7EF] text-success border-[#B6E6D0]">Checklists Up</span>
            <span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#FEF3E0] text-warn border-[#FAD999]">2 Timelines</span>
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
            <div class="flex flex-col items-center gap-[3px] flex-1"><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-[rgba(196,18,48,0.2)]" style="height:62px"></div><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-accent" style="height:47px"></div><div class="text-[9px] text-muted text-center">PR</div></div>
            <div class="flex flex-col items-center gap-[3px] flex-1"><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-[rgba(28,95,173,0.2)]" style="height:55px"></div><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-info" style="height:38px"></div><div class="text-[9px] text-muted text-center">Digital</div></div>
            <div class="flex flex-col items-center gap-[3px] flex-1"><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-[rgba(46,125,50,0.2)]" style="height:72px"></div><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-[#2E7D32]" style="height:59px"></div><div class="text-[9px] text-muted text-center">Creative</div></div>
            <div class="flex flex-col items-center gap-[3px] flex-1"><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-[rgba(224,122,0,0.2)]" style="height:48px"></div><div class="rounded-t-[3px] w-full cursor-pointer hover:opacity-80 bg-warn" style="height:44px"></div><div class="text-[9px] text-muted text-center">Admin</div></div>
          </div>
          <div class="flex gap-3 mt-2">
            <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-[#D1C0C2]"></div>Assigned</div>
            <div class="flex items-center gap-1.5 text-[10px] text-muted"><div class="w-2 h-2 rounded-[2px] bg-accent"></div>Completed</div>
          </div>
        </div>
      </div>
      <div>
        <div class="text-[13px] font-semibold mb-3.5">Recent Activity</div>
        <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
          <div v-for="item in activityFeed" :key="item.initials"
               class="flex items-start gap-3 px-4 py-3 border-b border-[#E1E4E9] last:border-b-0 hover:bg-[#F4F5F7] transition-colors">
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
</template>

<script setup>
defineEmits(['navigate', 'open-modal'])

const activityFeed = [
  { initials: 'AN', color: '#FF6600', name: 'Amara Nwosu',  dept: 'PR',       text: 'Uploaded newspaper cutout for Vanguard campaign',   status: 'Ready for Review', statusClass: 'bg-[#FEF3E0] text-warn',    time: '2m ago'  },
  { initials: 'KO', color: '#FF6600', name: 'Kemi Obi',     dept: 'Digital',  text: 'Submitted Q2 social media brief — 3 platforms',      status: 'Approved',         statusClass: 'bg-[#E6F7EF] text-success', time: '18m ago' },
  { initials: 'TM', color: '#FF6600', name: 'Tunde Makinde', dept: 'Creative', text: 'Uploaded brand identity poster pack (4 artworks)',   status: 'In Progress',      statusClass: 'bg-[#E4EDF9] text-info',    time: '1h ago'  },
  { initials: 'FA', color: '#FF6600', name: 'Funmi Adeola',  dept: 'Admin',    text: 'Updated procurement tracker — Q2 vendors confirmed', status: 'Completed',        statusClass: 'bg-[#E6F7EF] text-success', time: '3h ago'  },
]
</script>
