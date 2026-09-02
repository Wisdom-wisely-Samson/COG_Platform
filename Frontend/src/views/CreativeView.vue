<template>
  <div>
    <!-- Tabs -->
    <div class="flex border-b border-[#E1E4E9] mb-5">
      <div @click="tab = 'gallery'" :class="tab==='gallery' ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Asset Gallery</div>
      <div @click="tab = 'upload'"  :class="tab==='upload'  ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Upload Assets</div>
      <div @click="tab = 'video'"   :class="tab==='video'   ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-[#1A2332]'" class="px-4 py-[9px] text-xs font-medium cursor-pointer border-b-2 -mb-px transition-all">Videos &amp; GIFs</div>
    </div>

    <!-- Asset Gallery -->
    <div v-show="tab === 'gallery'">
      <div class="flex items-center justify-between mb-3.5">
        <div class="text-[13px] font-semibold">Still Artworks</div>
        <button @click="tab = 'upload'" class="inline-flex items-center gap-1 px-3 py-[6px] rounded-md border border-accent bg-accent text-[11px] text-white hover:opacity-90">
          <i class="ti ti-upload text-[13px]"></i>Upload
        </button>
      </div>

      <!-- Uploaded images from backend -->
      <div v-if="uploadedImages.length" class="grid gap-2.5 mb-6" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
        <div v-for="img in uploadedImages" :key="img.filename"
             class="border border-[#E1E4E9] rounded-md aspect-square overflow-hidden relative group cursor-pointer hover:border-accent/40 hover:shadow-md transition-all">
          <img :src="img.url" :alt="img.originalName"
               class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="text-[9px] text-white truncate">{{ img.originalName }}</div>
          </div>
          <span class="absolute top-1.5 right-1.5 text-[9px] px-[5px] py-[2px] rounded-[3px] font-semibold bg-[#E6F7EF] text-success">New</span>
        </div>
      </div>
      <div v-else class="bg-white border border-[#E1E4E9] rounded-[10px] p-6 text-center text-muted mb-6">
        No artwork assets have been uploaded yet. Use the Upload Assets tab to submit your first creative file.
      </div>

      <div class="text-[13px] font-semibold mb-3.5">Videos &amp; Animated GIFs</div>

      <!-- Uploaded videos from backend -->
      <div v-if="uploadedVideos.length" class="grid gap-2.5 mb-4" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
        <div v-for="vid in uploadedVideos" :key="vid.filename"
             class="border border-[#E1E4E9] rounded-md aspect-square overflow-hidden relative group cursor-pointer hover:opacity-90 transition-all bg-[#0D2B4F]">
          <video :src="vid.url" class="w-full h-full object-cover opacity-70" muted preload="metadata"></video>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <i class="ti ti-player-play text-[28px] text-white"></i>
            <div class="text-[9px] text-white/70 mt-1 text-center px-1 truncate max-w-full">{{ vid.originalName }}</div>
          </div>
          <span class="absolute top-1.5 right-1.5 text-[9px] px-[5px] py-[2px] rounded-[3px] font-semibold bg-[#E6F7EF] text-success">New</span>
        </div>
      </div>
      <div v-else class="bg-white border border-[#E1E4E9] rounded-[10px] p-6 text-center text-muted mb-6">
        No videos or GIFs have been uploaded yet. Submit a media asset in the Upload Assets tab to populate this view.
      </div>
    </div>

    <!-- Upload Assets -->
    <div v-show="tab === 'upload'">

      <!-- Success banner -->
      <div v-if="uploadSuccess"
           class="flex items-center gap-2 text-[12px] text-success bg-[#E6F7EF] border border-[#B6E6D0] rounded-md px-4 py-2.5 mb-4">
        <i class="ti ti-circle-check text-[16px]"></i>
        Assets uploaded successfully!
        <button @click="uploadSuccess = false; tab = 'gallery'" class="ml-auto text-[11px] underline bg-transparent border-none cursor-pointer text-success">View Gallery</button>
      </div>

      <!-- Error banner -->
      <div v-if="uploadError"
           class="flex items-center gap-2 text-[12px] text-accent bg-[#FDE8EC] border border-[#F5C0CB] rounded-md px-4 py-2.5 mb-4">
        <i class="ti ti-alert-circle text-[16px]"></i>{{ uploadError }}
      </div>

      <div class="grid grid-cols-2 gap-4">

        <!-- Still artworks drop zone -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Still Artworks (Images)</label>
          <div @click="pickImages"
               @dragover.prevent="imageDragOver = true"
               @dragleave.prevent="imageDragOver = false"
               @drop="onImageDrop"
               :class="imageDragOver ? 'border-accent bg-accent/[0.04]' : 'border-[#E1E4E9] bg-[#F9FAFB] hover:border-accent hover:bg-accent/[0.03]'"
               class="border-2 border-dashed rounded-[10px] p-5 text-center cursor-pointer transition-all">
            <div class="text-[24px] text-muted mb-1.5"><i class="ti ti-photo"></i></div>
            <div v-if="imageFiles.length === 0">
              <div class="text-xs font-medium mb-0.5">Drop hi-res artworks here or click to browse</div>
              <div class="text-[11px] text-muted">PNG, JPG, WEBP, PDF — max 50MB per file</div>
            </div>
            <div v-else>
              <div class="text-xs font-semibold text-[#1A2332] mb-1">{{ imageFiles.length }} file{{ imageFiles.length > 1 ? 's' : '' }} selected</div>
              <ul class="text-[10px] text-muted text-left inline-block">
                <li v-for="f in imageFiles" :key="f.name" class="truncate max-w-[180px]">
                  <i class="ti ti-file mr-1"></i>{{ f.name }} <span class="text-[9px]">({{ formatSize(f.size) }})</span>
                </li>
              </ul>
              <div class="text-[10px] text-accent mt-1.5 hover:underline">Click to change</div>
            </div>
          </div>
          <input ref="imageInput" type="file" accept="image/*,.pdf" multiple class="hidden" @change="onImagePick" />
        </div>

        <!-- Videos & GIFs drop zone -->
        <div>
          <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Videos &amp; GIFs</label>
          <div @click="pickVideos"
               @dragover.prevent="videoDragOver = true"
               @dragleave.prevent="videoDragOver = false"
               @drop="onVideoDrop"
               :class="videoDragOver ? 'border-accent bg-accent/[0.04]' : 'border-[#E1E4E9] bg-[#F9FAFB] hover:border-accent hover:bg-accent/[0.03]'"
               class="border-2 border-dashed rounded-[10px] p-5 text-center cursor-pointer transition-all">
            <div class="text-[24px] text-muted mb-1.5"><i class="ti ti-video"></i></div>
            <div v-if="videoFiles.length === 0">
              <div class="text-xs font-medium mb-0.5">Upload motion assets or click to browse</div>
              <div class="text-[11px] text-muted">MP4, MOV, GIF, WEBM — max 200MB</div>
            </div>
            <div v-else>
              <div class="text-xs font-semibold text-[#1A2332] mb-1">{{ videoFiles.length }} file{{ videoFiles.length > 1 ? 's' : '' }} selected</div>
              <ul class="text-[10px] text-muted text-left inline-block">
                <li v-for="f in videoFiles" :key="f.name" class="truncate max-w-[180px]">
                  <i class="ti ti-file mr-1"></i>{{ f.name }} <span class="text-[9px]">({{ formatSize(f.size) }})</span>
                </li>
              </ul>
              <div class="text-[10px] text-accent mt-1.5 hover:underline">Click to change</div>
            </div>
          </div>
          <input ref="videoInput" type="file" accept="video/*,.gif" multiple class="hidden" @change="onVideoPick" />
        </div>

      </div>

      <!-- Asset name -->
      <div class="mt-3.5">
        <label class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-muted mb-1.5">Asset Name / Description</label>
        <input v-model="assetName"
               class="bg-white border border-[#E1E4E9] rounded-md px-3 py-2 text-[13px] text-[#1A2332] w-full focus:outline-none focus:border-accent"
               placeholder="e.g. Brand Identity Poster — Final v3">
      </div>

      <!-- Actions -->
      <div class="mt-3.5 flex items-center gap-2 justify-between">
        <button @click="clearForm"
                class="inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-md border border-[#E1E4E9] bg-white text-xs text-muted hover:bg-[#F4F5F7]">
          Clear
        </button>
        <button @click="submitUpload"
                :disabled="uploading"
                class="inline-flex items-center gap-1.5 px-4 py-[7px] rounded-md border border-accent bg-accent text-xs text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
          <svg v-if="uploading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <i v-else class="ti ti-upload text-[13px]"></i>
          {{ uploading ? 'Uploading…' : 'Upload & Submit' }}
        </button>
      </div>
    </div>

    <!-- Videos & GIFs table -->
    <div v-show="tab === 'video'">
      <div class="bg-white border border-[#E1E4E9] rounded-[10px] overflow-hidden">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Title</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Format</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Size</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Status</th>
              <th class="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted border-b border-[#E1E4E9]">Submitted</th>
            </tr>
          </thead>
          <tbody>
            <!-- Real uploaded videos -->
            <tr v-for="vid in allUploadedVideos" :key="vid.filename" class="hover:[&>td]:bg-[#F4F5F7]">
              <td class="px-3 py-2.5 border-b border-[#E1E4E9]">
                <a :href="vid.url" target="_blank" class="text-info hover:underline">{{ vid.originalName }}</a>
              </td>
              <td class="px-3 py-2.5 border-b border-[#E1E4E9] uppercase text-[10px]">{{ ext(vid.originalName) }}</td>
              <td class="px-3 py-2.5 border-b border-[#E1E4E9]">{{ formatSize(vid.size) }}</td>
              <td class="px-3 py-2.5 border-b border-[#E1E4E9]"><span class="text-[10px] px-2 py-[3px] rounded-full font-medium border bg-[#FEF3E0] text-warn border-[#FAD999]">Review</span></td>
              <td class="px-3 py-2.5 border-b border-[#E1E4E9] text-muted">{{ vid.taskTitle }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api.js'

defineEmits(['open-modal'])

const tab = ref('gallery')

// ── Upload state ──────────────────────────────────────────────────────────────
const imageInput    = ref(null)
const videoInput    = ref(null)
const imageFiles    = ref([])
const videoFiles    = ref([])
const assetName     = ref('')
const uploading     = ref(false)
const uploadError   = ref('')
const uploadSuccess = ref(false)
const imageDragOver = ref(false)
const videoDragOver = ref(false)

// ── Assets from backend ───────────────────────────────────────────────────────
const tasks  = ref([])
const deptId = ref(null)

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i
const VIDEO_EXT = /\.(mp4|mov|webm|gif)$/i

// Flatten attachments from all Creative tasks, tagged with taskTitle
const uploadedImages = computed(() =>
  tasks.value.flatMap(t =>
    (t.attachments || [])
      .filter(a => IMAGE_EXT.test(a.originalName || a.filename))
      .map(a => ({ ...a }))
  )
)

const uploadedVideos = computed(() =>
  tasks.value.flatMap(t =>
    (t.attachments || [])
      .filter(a => VIDEO_EXT.test(a.originalName || a.filename) && !/\.gif$/i.test(a.originalName || a.filename))
      .map(a => ({ ...a, taskTitle: t.title }))
  )
)

// For the Videos tab table (includes GIFs)
const allUploadedVideos = computed(() =>
  tasks.value.flatMap(t =>
    (t.attachments || [])
      .filter(a => /\.(mp4|mov|webm|gif)$/i.test(a.originalName || a.filename))
      .map(a => ({ ...a, taskTitle: t.title }))
  )
)

async function loadAssets() {
  try {
    const [allTasks, depts] = await Promise.all([api.getTasks(), api.getDepartments()])
    const creativeDept = depts.find(d => d.name === 'Creative')
    if (creativeDept) {
      deptId.value = creativeDept._id
      tasks.value = allTasks.filter(t =>
        (t.department && (t.department._id === creativeDept._id || t.department === creativeDept._id)) ||
        t.departmentName === 'Creative'
      )
    }
  } catch (e) {
    console.error('Failed to load creative assets:', e.message)
  }
}

onMounted(loadAssets)

// ── File picking ──────────────────────────────────────────────────────────────
function pickImages() { imageInput.value?.click() }
function pickVideos() { videoInput.value?.click() }

function onImagePick(e) {
  imageFiles.value = Array.from(e.target.files)
  uploadError.value = ''
}

function onVideoPick(e) {
  videoFiles.value = Array.from(e.target.files)
  uploadError.value = ''
}

function onImageDrop(e) {
  e.preventDefault()
  imageDragOver.value = false
  imageFiles.value = Array.from(e.dataTransfer.files).filter(f => /\.(jpe?g|png|webp|pdf|gif)$/i.test(f.name))
  uploadError.value = ''
}

function onVideoDrop(e) {
  e.preventDefault()
  videoDragOver.value = false
  videoFiles.value = Array.from(e.dataTransfer.files).filter(f => /\.(mp4|mov|webm|gif)$/i.test(f.name))
  uploadError.value = ''
}

function clearForm() {
  imageFiles.value = []
  videoFiles.value = []
  assetName.value  = ''
  uploadError.value = ''
  uploadSuccess.value = false
  if (imageInput.value) imageInput.value.value = ''
  if (videoInput.value) videoInput.value.value = ''
}

// ── Submit upload ─────────────────────────────────────────────────────────────
async function submitUpload() {
  uploadError.value   = ''
  uploadSuccess.value = false

  const allFiles = [...imageFiles.value, ...videoFiles.value]
  if (!allFiles.length) {
    uploadError.value = 'Please select at least one file to upload.'
    return
  }
  if (!assetName.value.trim()) {
    uploadError.value = 'Please enter an asset name or description.'
    return
  }

  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('title', assetName.value.trim())
    fd.append('departmentName', 'Creative')
    if (deptId.value) fd.append('departmentId', deptId.value)
    fd.append('status', 'review')
    allFiles.forEach(f => fd.append('files', f))

    await api.createTask(fd)
    uploadSuccess.value = true
    clearForm()
    await loadAssets()
  } catch (e) {
    uploadError.value = e.message || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ext(filename) {
  return (filename || '').split('.').pop().toUpperCase()
}

</script>
