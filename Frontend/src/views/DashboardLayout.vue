<template>
  <div class="flex h-screen overflow-hidden relative bg-[#F4F5F7] font-sans text-[#1A2332] text-sm" style="min-height:600px">

    <!-- ===== SIDEBAR ===== -->
    <nav class="w-55 bg-navy flex flex-col shrink-0">
      <div class="px-4 py-3.5 border-b border-white/10">
        <div class="bg-white rounded-lg px-3 py-2 inline-flex items-center">
          <img src="/logo images/Logo.svg" alt="Capital One Group" class="h-8 w-auto" />
        </div>
      </div>

      <div class="p-2 flex-1">

        <!-- Admin-only: Overview -->
        <template v-if="isAdmin">
          <div class="text-white/35 text-[10px] font-medium tracking-widest uppercase px-2 py-1.5">Overview</div>

          <div @click="router.push('/dashboard')"
               :class="route.path === '/dashboard' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
               class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
            <i class="ti ti-layout-dashboard text-base w-4.5 text-center"></i><span>Dashboard</span>
          </div>

          <div @click="router.push('/taskboard')"
               :class="route.path === '/taskboard' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
               class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
            <i class="ti ti-clipboard-list text-base w-4.5 text-center"></i><span>Task Board</span>
            <span :class="route.path === '/taskboard' ? 'bg-white/25' : 'bg-white/15'"
                  class="ml-auto text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">7</span>
          </div>
        </template>

        <!-- Departments -->
        <div class="text-white/35 text-[10px] font-medium tracking-widest uppercase px-2 py-1.5 mt-2">
          {{ isAdmin ? 'Departments' : 'My Department' }}
        </div>

        <div v-if="isAdmin || userDept === '/pr'"
             @click="router.push('/pr')"
             :class="route.path === '/pr' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
             class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
          <span class="w-2 h-2 rounded-full shrink-0 bg-accent"></span><span>PR &amp; Media</span>
          <span :class="route.path === '/pr' ? 'bg-white/25' : 'bg-white/15'"
                class="ml-auto text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">3</span>
        </div>

        <div v-if="isAdmin || userDept === '/digital'"
             @click="router.push('/digital')"
             :class="route.path === '/digital' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
             class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
          <span class="w-2 h-2 rounded-full shrink-0 bg-info"></span><span>Digital</span>
          <span :class="route.path === '/digital' ? 'bg-white/25' : 'bg-white/15'"
                class="ml-auto text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">5</span>
        </div>

        <div v-if="isAdmin || userDept === '/creative'"
             @click="router.push('/creative')"
             :class="route.path === '/creative' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
             class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
          <span class="w-2 h-2 rounded-full shrink-0 bg-[#2E7D32]"></span><span>Creative</span>
          <span :class="route.path === '/creative' ? 'bg-white/25' : 'bg-white/15'"
                class="ml-auto text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">8</span>
        </div>

        <div v-if="isAdmin || userDept === '/admin'"
             @click="router.push('/admin')"
             :class="route.path === '/admin' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
             class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
          <span class="w-2 h-2 rounded-full shrink-0 bg-warn"></span><span>Admin / Ops</span>
          <span :class="route.path === '/admin' ? 'bg-white/25' : 'bg-white/15'"
                class="ml-auto text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">2</span>
        </div>

        <!-- Admin-only: Reports + Users -->
        <template v-if="isAdmin">
          <div class="text-white/35 text-[10px] font-medium tracking-widest uppercase px-2 py-1.5 mt-2">Reports</div>

          <div @click="router.push('/analytics')"
               :class="route.path === '/analytics' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
               class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
            <i class="ti ti-chart-bar text-base w-4.5 text-center"></i><span>Analytics</span>
          </div>

          <div class="text-white/35 text-[10px] font-medium tracking-widest uppercase px-2 py-1.5 mt-2">Management</div>

          <div @click="router.push('/users')"
               :class="route.path === '/users' ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'"
               class="flex items-center gap-2.5 px-2.5 py-2.25 rounded-md cursor-pointer text-[13px] transition-all mb-px">
            <i class="ti ti-users text-base w-4.5 text-center"></i><span>Users</span>
          </div>
        </template>

      </div>

      <!-- User + Logout -->
      <div class="p-3 border-t border-white/10">
        <div class="flex items-center gap-2 p-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
               :style="{ background: '#FF6600' }">{{ user?.initials ?? 'SA' }}</div>
          <div class="flex-1 min-w-0">
            <div class="text-white/85 text-xs font-medium truncate">{{ user?.name ?? 'Super Admin' }}</div>
            <div class="text-white/40 text-[10px]">{{ isAdmin ? 'Executive Access' : isHead ? 'Head of Department' : (DEPT_LABELS[userDept] ?? 'Staff') }}</div>
          </div>
          <button @click="openChangePwd"
                  title="Change password"
                  class="bg-transparent border-none cursor-pointer text-white/40 hover:text-white/80 transition-colors p-1 rounded">
            <i class="ti ti-lock text-[15px]"></i>
          </button>
          <button @click="logout"
                  title="Sign out"
                  class="bg-transparent border-none cursor-pointer text-white/40 hover:text-white/80 transition-colors p-1 rounded">
            <i class="ti ti-logout text-[16px]"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- ===== MAIN ===== -->
    <div class="flex-1 overflow-y-auto flex flex-col">

      <!-- Topbar -->
      <div class="bg-white border-b border-[#E1E4E9] px-6 h-14 flex items-center gap-3 shrink-0">
        <div class="flex-1">
          <div class="text-[15px] font-semibold text-[#1A2332]">{{ pageTitle }}</div>
          <div class="text-[11px] text-muted">{{ pageSub }}</div>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-1.75 h-1.75 bg-success rounded-full animate-live"></span>
          <span class="text-[11px] text-muted">Live</span>
        </div>
        <!-- Notification Bell -->
        <div class="relative" ref="bellRef">
          <div
            @click="toggleNotifications"
            class="relative w-8 h-8 rounded-md border border-[#E1E4E9] bg-white flex items-center justify-center cursor-pointer text-muted text-base hover:bg-[#F4F5F7] transition-colors"
          >
            <i class="ti ti-bell"></i>
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white"
            >{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </div>

          <!-- Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 top-10 w-[340px] bg-white border border-[#E1E4E9] rounded-[10px] shadow-xl z-50 overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-[#E1E4E9]">
              <div class="text-[13px] font-semibold">Notifications
                <span v-if="unreadCount > 0" class="ml-1.5 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-medium">{{ unreadCount }}</span>
              </div>
              <button
                v-if="unreadCount > 0"
                @click="markAll"
                class="text-[11px] text-info hover:underline bg-transparent border-none cursor-pointer"
              >Mark all read</button>
            </div>

            <!-- List -->
            <div class="max-h-[360px] overflow-y-auto divide-y divide-[#F4F5F7]">
              <!-- Loading -->
              <div v-if="loadingNotifs" class="flex items-center justify-center py-8 text-muted text-xs gap-2">
                <i class="ti ti-loader-2 animate-spin text-base"></i> Loading…
              </div>

              <!-- Empty -->
              <div v-else-if="notifications.length === 0" class="py-10 text-center text-muted text-xs">
                <i class="ti ti-bell-off text-2xl block mb-2"></i>
                No notifications yet
              </div>

              <!-- Items -->
              <div
                v-else
                v-for="n in notifications"
                :key="n._id"
                @click="readNotif(n)"
                class="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                :class="n.read ? 'bg-white hover:bg-[#F9FAFB]' : 'bg-[#FEF3F4] hover:bg-[#fde8ea]'"
              >
                <div class="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i class="ti ti-clipboard-check text-accent text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[12px] leading-snug" :class="n.read ? 'text-muted' : 'text-[#1A2332] font-medium'">
                    {{ n.message }}
                  </div>
                  <div class="text-[10px] text-muted mt-0.5">{{ timeAgo(n.createdAt) }}</div>
                </div>
                <span v-if="!n.read" class="w-2 h-2 bg-accent rounded-full shrink-0 mt-1.5"></span>
              </div>
            </div>
          </div>
        </div>
        <span class="bg-navy text-white/90 text-[10px] px-2 py-0.75 rounded-[3px] font-medium">
          {{ isAdmin ? 'Super Admin' : isHead ? 'Dept Head' : (DEPT_LABELS[userDept] ?? 'Staff') }}
        </span>
        <button v-if="canLogActivity"
                @click="openModal"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-accent bg-accent cursor-pointer text-xs text-white transition-all hover:opacity-90">
          <i class="ti ti-plus text-[15px]"></i>Log Activity
        </button>
      </div>

      <!-- Page Content — rendered by the router -->
      <div class="p-6 flex-1">
        <RouterView @navigate="router.push($event)" @open-modal="openModal" />
      </div>

    </div><!-- /main -->

    <!-- ===== CHANGE PASSWORD MODAL ===== -->
    <div v-show="showChangePwd" @click.self="closeChangePwd"
         class="absolute inset-0 bg-black/45 z-100 flex items-center justify-center">
      <div class="bg-white rounded-[10px] w-[420px] max-w-[95%] shadow-2xl overflow-hidden">

        <div class="px-5 py-4 border-b border-[#E1E4E9] flex items-center justify-between">
          <div class="text-[14px] font-semibold">Change Password</div>
          <button @click="closeChangePwd" class="bg-transparent border-none cursor-pointer text-muted text-lg leading-none px-1 hover:text-[#1A2332]">✕</button>
        </div>

        <div class="p-5">
          <!-- Error / Success -->
          <div v-if="changePwdError"
               class="flex items-center gap-2 text-[12px] text-accent bg-[#FDE8EC] border border-[#F5C0CB] rounded-md px-3 py-2.5 mb-4">
            <i class="ti ti-alert-circle text-[14px]"></i>{{ changePwdError }}
          </div>
          <div v-if="changePwdSuccess"
               class="flex items-center gap-2 text-[12px] text-success bg-[#E6F7EF] border border-[#B6E6D0] rounded-md px-3 py-2.5 mb-4">
            <i class="ti ti-circle-check text-[14px]"></i>{{ changePwdSuccess }}
          </div>

          <!-- Current password -->
          <div class="mb-3">
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Current Password</label>
            <div class="relative">
              <input v-model="changePwd.current" :type="showCurrent ? 'text' : 'password'" autocomplete="off"
                     placeholder="Enter current password"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full pr-10 focus:outline-none focus:border-accent transition-colors">
              <button type="button" @click="showCurrent = !showCurrent"
                      class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted hover:text-[#1A2332]">
                <i :class="showCurrent ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-[15px]"></i>
              </button>
            </div>
          </div>

          <!-- New password -->
          <div class="mb-3">
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">New Password</label>
            <div class="relative">
              <input v-model="changePwd.new" :type="showNewPwd ? 'text' : 'password'" autocomplete="off"
                     placeholder="Min. 6 characters"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full pr-10 focus:outline-none focus:border-accent transition-colors">
              <button type="button" @click="showNewPwd = !showNewPwd"
                      class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted hover:text-[#1A2332]">
                <i :class="showNewPwd ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-[15px]"></i>
              </button>
            </div>
          </div>

          <!-- Confirm new password -->
          <div class="mb-5">
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Confirm New Password</label>
            <input v-model="changePwd.confirm" :type="showNewPwd ? 'text' : 'password'" autocomplete="off"
                   placeholder="Repeat new password"
                   class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2.5 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent transition-colors">
          </div>

          <div class="flex gap-2">
            <button @click="closeChangePwd"
                    class="flex-1 py-2.5 rounded-md border border-[#E1E4E9] bg-white text-[13px] text-muted hover:bg-[#F4F5F7] cursor-pointer">
              Cancel
            </button>
            <button @click="submitChangePwd" :disabled="changePwdLoading"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-accent text-white text-[13px] font-medium cursor-pointer hover:opacity-90 disabled:opacity-60 border border-accent">
              <svg v-if="changePwdLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ changePwdLoading ? 'Saving…' : 'Update Password' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ===== LOG ACTIVITY MODAL ===== -->
    <div v-show="isModalOpen" @click.self="closeModal"
         class="absolute inset-0 bg-black/45 z-100 flex items-center justify-center">
      <div class="bg-white rounded-[10px] w-[560px] max-w-[95%] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="px-5 py-4 border-b border-[#E1E4E9] flex items-center justify-between shrink-0">
          <div class="text-[14px] font-semibold">Log New Activity</div>
          <button @click="closeModal" class="bg-transparent border-none cursor-pointer text-muted text-lg leading-none px-1 py-0.5 hover:text-[#1A2332]">✕</button>
        </div>

        <!-- Body -->
        <div class="p-5 overflow-y-auto flex-1">

          <!-- Error -->
          <div v-if="submitError"
               class="flex items-center gap-2 text-[12px] text-accent bg-[#FDE8EC] border border-[#F5C0CB] rounded-md px-3 py-2.5 mb-4">
            <i class="ti ti-alert-circle text-[14px]"></i>{{ submitError }}
          </div>

          <!-- Department + Assign To -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Department</label>
              <select v-model="form.departmentName"
                      class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent">
                <option value="">— Select —</option>
                <option>PR &amp; Media</option>
                <option>Digital</option>
                <option>Creative</option>
                <option>Admin / Operations</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Assign To</label>
              <select v-model="form.assignTo"
                      class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent">
                <option value="">— Select —</option>
                <option>Amara Nwosu</option>
                <option>Kemi Obi</option>
                <option>Tunde Makinde</option>
                <option>Funmi Adeola</option>
              </select>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-4">
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Activity / Task Title <span class="text-accent">*</span></label>
            <input v-model="form.title"
                   :class="{ 'border-accent/70 bg-[#FFF8F8]': !form.title && submitError }"
                   class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent"
                   placeholder="e.g. Upload press clippings for Q2 investor brief">
          </div>

          <!-- Due Date + Priority -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Due Date</label>
              <input v-model="form.dueDate" type="date"
                     class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent">
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Priority</label>
              <select v-model="form.priority"
                      class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-4">
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Notes</label>
            <textarea v-model="form.notes"
                      class="bg-white border border-[#E1E4E9] rounded-md p-3 text-[13px] leading-relaxed min-h-20 text-[#1A2332] resize-y w-full focus:outline-none focus:border-accent"
                      rows="3" placeholder="Add context or instructions..."></textarea>
          </div>

          <!-- File Attachment -->
          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Attachments</label>

            <!-- Drop zone -->
            <div @dragover.prevent="isDragging = true"
                 @dragleave.prevent="isDragging = false"
                 @drop.prevent="onDrop"
                 @click="fileInput.click()"
                 :class="isDragging ? 'border-accent bg-[#FFF5F5]' : 'border-[#E1E4E9] hover:border-accent'"
                 class="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors">
              <i class="ti ti-cloud-upload text-[30px] text-muted mb-1.5 block"></i>
              <div class="text-[12px] text-[#1A2332] font-medium">Drop files here or <span class="text-accent">browse</span></div>
              <div class="text-[10px] text-muted mt-0.5">PDF, Images, Word, Excel, ZIP — max 10 MB each</div>
              <input ref="fileInput" type="file" multiple class="hidden" @change="onFilePick">
            </div>

            <!-- Selected files list -->
            <div v-if="attachedFiles.length" class="mt-3 space-y-1.5">
              <div v-for="(f, i) in attachedFiles" :key="i"
                   class="flex items-center gap-2.5 bg-[#F9FAFB] border border-[#E1E4E9] rounded-md px-3 py-2">
                <i :class="fileIcon(f)" class="ti text-[16px] text-muted shrink-0"></i>
                <div class="flex-1 min-w-0">
                  <div class="text-[12px] font-medium text-[#1A2332] truncate">{{ f.name }}</div>
                  <div class="text-[10px] text-muted">{{ formatSize(f.size) }}</div>
                </div>
                <button @click.stop="removeFile(i)"
                        class="w-5 h-5 flex items-center justify-center rounded text-muted hover:text-accent hover:bg-[#FDE8EC] transition-colors bg-transparent border-none cursor-pointer">
                  <i class="ti ti-x text-[12px]"></i>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-[#E1E4E9] flex justify-end gap-2 bg-[#F9FAFB] shrink-0">
          <button @click="closeModal"
                  :disabled="submitting"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7] cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button @click="submitTask"
                  :disabled="submitting"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 cursor-pointer disabled:opacity-60">
            <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <i v-else class="ti ti-check text-[14px]"></i>
            {{ submitting ? 'Saving…' : 'Assign Task' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUser, clearUser, DEPT_LABELS } from '../users.js'
import { api } from '../api.js'

const router = useRouter()
const route  = useRoute()

const isModalOpen = ref(false)

const user           = computed(() => getUser())
const isAdmin        = computed(() => user.value?.role === 'admin')
const isHead         = computed(() => user.value?.role === 'head')
const canLogActivity = computed(() => isAdmin.value || isHead.value)
const userDept       = computed(() => user.value?.dept ?? null)

// ── Modal form state ──────────────────────────────────────────────────────
const emptyForm = () => ({ departmentName: '', assignTo: '', title: '', dueDate: '', priority: 'Medium', notes: '' })
const form          = ref(emptyForm())
const attachedFiles = ref([])
const fileInput     = ref(null)
const isDragging    = ref(false)
const submitting    = ref(false)
const submitError   = ref('')

function openModal() {
  form.value    = emptyForm()
  attachedFiles.value = []
  submitError.value   = ''
  isModalOpen.value   = true
}

function closeModal() {
  isModalOpen.value = false
}

function onFilePick(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  addFiles(e.dataTransfer.files)
}

function addFiles(fileList) {
  for (const f of fileList) {
    if (f.size > 10 * 1024 * 1024) {
      submitError.value = `"${f.name}" exceeds the 10 MB limit.`
      continue
    }
    attachedFiles.value.push(f)
  }
}

function removeFile(i) {
  attachedFiles.value.splice(i, 1)
}

function fileIcon(f) {
  const t = f.type
  if (t.startsWith('image/'))                           return 'ti-photo'
  if (t === 'application/pdf')                          return 'ti-file-type-pdf'
  if (t.includes('word') || t.includes('document'))    return 'ti-file-type-doc'
  if (t.includes('sheet') || t.includes('excel'))      return 'ti-file-spreadsheet'
  if (t.includes('presentation') || t.includes('powerpoint')) return 'ti-presentation'
  if (t.includes('zip') || t.includes('rar'))          return 'ti-file-zip'
  return 'ti-file'
}

function formatSize(bytes) {
  if (bytes < 1024)            return bytes + ' B'
  if (bytes < 1024 * 1024)     return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function submitTask() {
  submitError.value = ''
  if (!form.value.title.trim()) {
    submitError.value = 'Task title is required.'
    return
  }

  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('title',          form.value.title.trim())
    fd.append('departmentName', form.value.departmentName)
    fd.append('assignedTo',      form.value.assignTo)
    fd.append('dueDate',        form.value.dueDate)
    fd.append('priority',       form.value.priority)
    fd.append('notes',          form.value.notes)
    attachedFiles.value.forEach(f => fd.append('files', f))

    await api.createTask(fd)
    closeModal()
  } catch (err) {
    submitError.value = err.message || 'Failed to save task. Please try again.'
  } finally {
    submitting.value = false
  }
}

const titles = {
  '/dashboard' : 'Executive Dashboard',
  '/taskboard' : 'Task Board',
  '/pr'        : 'PR & Media',
  '/digital'   : 'Digital',
  '/creative'  : 'Creative',
  '/admin'     : 'Admin / Operations',
  '/analytics' : 'Analytics',
  '/users'     : 'User Management',
}
const subs = {
  '/dashboard' : 'All Departments — Real-time Overview',
  '/taskboard' : 'All open and completed tasks',
  '/pr'        : 'Public Relations Department',
  '/digital'   : 'Digital & Social Media Department',
  '/creative'  : 'Creative Department',
  '/admin'     : 'Admin & Operations Department',
  '/analytics' : 'Cross-departmental performance analytics',
  '/users'     : 'Add, edit and manage platform users',
}

const pageTitle = computed(() => titles[route.path] || '')
const pageSub   = computed(() => subs[route.path]   || '')

function logout() {
  clearUser()
  router.replace('/login')
}

// ── Notifications ─────────────────────────────────────────────────────────────
const bellRef          = ref(null)
const showNotifications = ref(false)
const notifications    = ref([])
const unreadCount      = ref(0)
const loadingNotifs    = ref(false)

async function fetchNotifications() {
  loadingNotifs.value = true
  try {
    const data = await api.getNotifications()
    notifications.value = data.notifications
    unreadCount.value   = data.unreadCount
  } catch {
    // silently fail if backend unavailable
  } finally {
    loadingNotifs.value = false
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) fetchNotifications()
}

// Map department name (as stored on Task) → front-end route
const DEPT_ROUTE = {
  'PR & Media':         '/pr',
  'Digital':            '/digital',
  'Creative':           '/creative',
  'Admin / Ops':        '/admin',
  'Admin / Operations': '/admin',
}

function notifRoute(n) {
  // Prefer the task's department if available
  if (n.task?.departmentName) {
    const r = DEPT_ROUTE[n.task.departmentName]
    if (r) return r
  }
  // Admins fall back to the task board; dept users stay on their own page
  if (isAdmin.value) return '/taskboard'
  return userDept.value ?? null
}

async function readNotif(n) {
  // Mark as read (fire-and-forget — don't block navigation)
  if (!n.read) {
    api.markNotifRead(n._id).then(() => {
      n.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }).catch(() => { /* ignore */ })
  }

  // Close dropdown and navigate
  showNotifications.value = false
  const dest = notifRoute(n)
  if (dest) router.push(dest)
}

async function markAll() {
  try {
    await api.markAllNotifsRead()
    notifications.value.forEach(n => { n.read = true })
    unreadCount.value = 0
  } catch { /* ignore */ }
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Close dropdown when clicking outside
function onClickOutside(e) {
  if (bellRef.value && !bellRef.value.contains(e.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

// ── Change Password ───────────────────────────────────────────────────────────
const showChangePwd   = ref(false)
const changePwdLoading = ref(false)
const changePwdError  = ref('')
const changePwdSuccess = ref('')
const showCurrent     = ref(false)
const showNewPwd      = ref(false)
const changePwd       = ref({ current: '', new: '', confirm: '' })

function openChangePwd() {
  changePwd.value      = { current: '', new: '', confirm: '' }
  changePwdError.value  = ''
  changePwdSuccess.value = ''
  showCurrent.value    = false
  showNewPwd.value     = false
  showChangePwd.value  = true
}

function closeChangePwd() {
  showChangePwd.value = false
}

async function submitChangePwd() {
  changePwdError.value  = ''
  changePwdSuccess.value = ''

  if (!changePwd.value.current)        { changePwdError.value = 'Please enter your current password.'; return }
  if (!changePwd.value.new)            { changePwdError.value = 'Please enter a new password.'; return }
  if (changePwd.value.new.length < 6)  { changePwdError.value = 'New password must be at least 6 characters.'; return }
  if (changePwd.value.new !== changePwd.value.confirm) {
    changePwdError.value = 'Passwords do not match.'
    return
  }

  changePwdLoading.value = true
  try {
    const res = await api.changePassword(changePwd.value.current, changePwd.value.new)
    changePwdSuccess.value = res.message || 'Password changed successfully.'
    changePwd.value = { current: '', new: '', confirm: '' }
    setTimeout(closeChangePwd, 2000)
  } catch (e) {
    changePwdError.value = e.message || 'Failed to change password. Please try again.'
  } finally {
    changePwdLoading.value = false
  }
}
</script>
