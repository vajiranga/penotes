<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-2">
    
    <!-- Dashboard Header -->
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <h4 class="text-weight-bold text-grey-9 q-my-none">
          {{ isSuperAdmin ? 'Super Admin Dashboard' : 'Contributor Dashboard' }}
        </h4>
        <p class="text-subtitle1 text-grey-6 q-mt-xs q-mb-none">
          Welcome, <span class="text-weight-bold text-indigo-9">{{ currentUser.name }}</span>
        </p>
      </div>
      <q-btn color="negative" icon="logout" label="Logout" @click="logout" outline />
    </div>

    <!-- Main Management Area -->
    <q-card class="shadow-2" style="border-radius: 12px;">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="indigo-9"
        indicator-color="indigo-9"
        align="left"
        narrow-indicator
      >
        <!-- Super Admin Tabs -->
        <template v-if="isSuperAdmin">
          <q-tab name="notices" icon="campaign" label="Notice Board" />
          <q-tab name="subjects" icon="class" label="Subjects" />
          <q-tab name="team" icon="manage_accounts" label="Team & Contributors" />
        </template>
        
        <!-- Sub Admin Tab -->
        <template v-if="isSubAdmin">
          <q-tab name="uploads" icon="cloud_upload" label="Upload Materials" />
          <q-tab name="profile" icon="person" label="My Profile" />
        </template>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        
        <!-- ======================= -->
        <!--   SUPER ADMIN PANELS    -->
        <!-- ======================= -->
        
        <!-- Notices Tab -->
        <q-tab-panel name="notices" class="q-pa-md" v-if="isSuperAdmin">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-bold">Manage Notices</div>
            <q-btn color="indigo" icon="add" label="Add Notice" @click="showAddDialog('notice')" />
          </div>
          <q-table flat bordered :rows="notices" :columns="noticeColumns" row-key="id" hide-pagination>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="blue" icon="edit" size="sm" @click="editItem('notice', props.row)" />
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('notice', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Subjects Tab -->
        <q-tab-panel name="subjects" class="q-pa-md" v-if="isSuperAdmin">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-bold">Manage Subjects</div>
            <q-btn color="indigo" icon="add" label="Add Subject" @click="showAddDialog('subject')" />
          </div>
          <q-table flat bordered :rows="subjects" :columns="subjectColumns" row-key="id" hide-pagination>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="blue" icon="edit" size="sm" @click="editItem('subject', props.row)" />
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('subject', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Team & Contributors Tab -->
        <q-tab-panel name="team" class="q-pa-md" v-if="isSuperAdmin">
          <div class="row justify-between items-center q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold">Manage Team & Contributors</div>
              <p class="text-grey-7 q-mb-none">Set access rights, display order, and custom tags for uploaders.</p>
            </div>
            <q-btn color="indigo" icon="person_add" label="Add Contributor" @click="adminDialog = true" />
          </div>
          <q-table flat bordered :rows="team" :columns="teamColumns" row-key="id" hide-pagination>
            <template v-slot:body-cell-photo="props">
              <q-td :props="props">
                <q-avatar size="40px"><img :src="props.row.photo" /></q-avatar>
              </q-td>
            </template>
            <!-- Editable Tag -->
            <template v-slot:body-cell-tag="props">
              <q-td :props="props">
                <q-chip v-if="props.row.tag" color="orange" text-color="white" size="sm">{{ props.row.tag }}</q-chip>
                <span v-else class="text-grey italic">No Tag</span>
                <q-popup-edit v-model="props.row.tag" title="Update Tag" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus hint="e.g. Highly Recommended" />
                </q-popup-edit>
              </q-td>
            </template>
            <!-- Editable Order -->
            <template v-slot:body-cell-order="props">
              <q-td :props="props">
                {{ props.row.order }}
                <q-popup-edit v-model="props.row.order" title="Update Order" buttons v-slot="scope">
                  <q-input type="number" v-model="scope.value" dense autofocus />
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="blue" icon="edit" size="sm" @click="editItem('team', props.row)" />
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('team', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- ======================= -->
        <!--    SUB ADMIN PANELS     -->
        <!-- ======================= -->
        <q-tab-panel name="uploads" class="q-pa-md" v-if="isSubAdmin">
          <div class="row q-mb-lg">
            <div class="col-12 col-md-8">
              <q-card class="bg-indigo-1 q-pa-md" flat bordered>
                <div class="text-h6 text-indigo-9 q-mb-md">Upload New Material</div>
                
                <q-form @submit="handleUpload" class="q-gutter-md">
                  
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-sm-6">
                      <q-select 
                        v-model="uploadForm.subject" 
                        :options="currentUser.subjects" 
                        label="Select Subject" 
                        filled 
                        required 
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-select 
                        v-model="uploadForm.module" 
                        :options="currentUser.modules" 
                        label="Select Module" 
                        filled 
                        required 
                      />
                    </div>
                  </div>

                  <q-input 
                    v-model="uploadForm.title" 
                    label="Material Title (Optional)" 
                    filled 
                    hint="Leave blank to use the file name"
                  />

                  <q-file 
                    v-model="uploadFile" 
                    label="Drag & Drop or Click to Select File" 
                    filled 
                    bottom-slots
                    counter
                    class="q-mt-md"
                    accept=".pdf, image/*, .doc, .docx, .zip"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>

                  <div class="row justify-end q-mt-md">
                    <q-btn type="submit" label="Save to Database" color="indigo-9" icon="cloud_done" />
                  </div>
                </q-form>

              </q-card>
            </div>
          </div>
          
          <div class="text-h6 text-weight-bold q-mb-sm">My Recent Uploads</div>
          <q-table flat bordered :rows="myUploads" :columns="uploadColumns" row-key="id" hide-pagination>
            <template v-slot:body-cell-file="props">
              <q-td :props="props">
                <span v-if="props.row.fileName">{{ props.row.fileName }}</span>
                <a v-else-if="props.row.driveLink" :href="props.row.driveLink" target="_blank" class="text-indigo">View in Drive</a>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Sub Admin Profile Tab -->
        <q-tab-panel name="profile" class="q-pa-md" v-if="isSubAdmin">
          <div class="row q-mb-lg justify-center">
            <div class="col-12 col-md-6">
              <q-card class="q-pa-lg" flat bordered>
                <div class="text-center q-mb-lg">
                  <q-avatar size="100px" class="shadow-2 q-mb-md">
                    <img :src="myProfile.photo || 'https://cdn.quasar.dev/img/avatar.png'" />
                  </q-avatar>
                  <div class="text-h5 text-weight-bold">{{ currentUser.name }}</div>
                  <div class="text-grey-7">{{ currentUser.username }}</div>
                </div>

                <q-form @submit="saveMyProfile" class="q-gutter-md">
                  <q-input 
                    v-model="myProfile.password" 
                    type="password" 
                    label="Update Password" 
                    filled 
                    hint="Leave blank to keep current password"
                  />
                  
                  <q-file 
                    v-model="myProfilePhotoFile" 
                    label="Update Profile Photo" 
                    filled 
                    accept="image/*" 
                    @update:model-value="handleMyPhotoUpload" 
                  >
                    <template v-slot:prepend>
                      <q-icon name="photo_camera" />
                    </template>
                  </q-file>

                  <div class="row justify-end q-mt-lg">
                    <q-btn type="submit" label="Save Changes" color="indigo-9" icon="save" />
                  </div>
                </q-form>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>

    <!-- Custom Add Contributor/Admin Dialog -->
    <q-dialog v-model="adminDialog" persistent>
      <q-card style="min-width: 500px; border-radius: 12px;">
        <q-card-section class="bg-indigo-9 text-white">
          <div class="text-h6 text-weight-bold">Add Contributor / Admin</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-form @submit="saveAdmin" class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input v-model="newAdmin.name" label="Full Name" filled required />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="newAdmin.username" type="email" label="Email / Username" filled required />
              </div>
            </div>
            
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input v-model="newAdmin.password" type="password" label="Password" filled required />
              </div>
              <div class="col-12 col-sm-6">
                <q-file 
                  v-model="adminPhotoFile" 
                  label="Upload Photo (Optional)" 
                  filled 
                  accept="image/*" 
                  @update:model-value="handleAdminPhotoUpload" 
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>

            <q-select 
              v-model="newAdmin.modules" 
              multiple 
              :options="['Notes', 'Mind Maps', 'Lab Reports', 'Past Papers']" 
              label="Assigned Modules" 
              filled 
              use-chips 
              required 
            />
            
            <q-select 
              v-model="newAdmin.subjects" 
              multiple 
              :options="subjects.map(s => s.code + ' - ' + s.name)" 
              label="Assigned Subjects" 
              filled 
              use-chips 
              required 
            />

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input v-model="newAdmin.tag" label="Custom Tag (Optional)" hint="e.g. Highly Recommended" filled />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model.number="newAdmin.order" type="number" label="Display Order" hint="1 is first" filled />
              </div>
            </div>
            
            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="grey-8" v-close-popup />
              <q-btn type="submit" label="Save Contributor" color="indigo-9" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Custom Add Notice Dialog -->
    <q-dialog v-model="noticeDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-indigo-9 text-white">
          <div class="text-h6 text-weight-bold">Add New Notice</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-form @submit="saveNotice" class="q-gutter-md">
            <q-input v-model="newNotice.title" label="Notice Title" filled required />
            <q-select v-model="newNotice.type" :options="['Text', 'Image']" label="Notice Type" filled required />
            
            <q-file 
              v-if="newNotice.type === 'Image'" 
              v-model="noticeFile" 
              label="Upload Image" 
              filled 
              accept="image/*" 
              @update:model-value="handleNoticeImageUpload" 
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-input v-model="newNotice.date" type="date" label="Date Posted" filled required />
            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="grey-8" v-close-popup />
              <q-btn type="submit" label="Save Notice" color="indigo-9" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Custom Add Subject Dialog -->
    <q-dialog v-model="subjectDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-indigo-9 text-white">
          <div class="text-h6 text-weight-bold">Add New Subject</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-form @submit="saveSubject" class="q-gutter-md">
            <q-input v-model="newSubject.code" label="Subject Code (e.g. PHY101)" filled required />
            <q-input v-model="newSubject.name" label="Subject Name" filled required />
            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="grey-8" v-close-popup />
              <q-btn type="submit" label="Save Subject" color="indigo-9" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $router = useRouter()
const $q = useQuasar()

// --- Role Management ---
const currentUser = ref({ role: '', name: '', modules: [], subjects: [] })
const isSuperAdmin = computed(() => currentUser.value.role === 'superadmin')
const isSubAdmin = computed(() => currentUser.value.role === 'subadmin')

const tab = ref('')

// Initialize Data from LocalStorage or fallback to Mock Data
const notices = ref(JSON.parse(localStorage.getItem('campus_notices')) || [
  { id: 1, title: 'Welcome to Semester 2!', type: 'Text', date: '2026-05-18' }
])
const subjects = ref(JSON.parse(localStorage.getItem('campus_subjects')) || [
  { id: 1, name: 'Physics 101 (Mechanics)', code: 'PHY101' },
  { id: 2, name: 'Applied Mathematics', code: 'MAT201' },
  { id: 3, name: 'Computer Science Basics', code: 'CSC101' }
])
const team = ref(JSON.parse(localStorage.getItem('campus_team')) || [
  { id: 1, name: 'Dr. Kasun Perera', username: 'kasun@admin.com', tag: 'Highly Recommended', order: 1, modules: 'Notes', subjects: 'PHY101', photo: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { id: 2, name: 'Amali Fernando', username: 'amali@admin.com', tag: 'Top Contributor', order: 2, modules: 'Lab Reports', subjects: 'MAT201', photo: 'https://cdn.quasar.dev/img/avatar3.jpg' }
])
const myUploads = ref(JSON.parse(localStorage.getItem('campus_uploads')) || [
  { id: 1, title: 'Chapter 1 Notes', module: 'Notes', subject: 'PHY101', type: 'PDF', driveLink: 'https://drive.google.com/test' }
])

watch(notices, (newVal) => {
  try {
    localStorage.setItem('campus_notices', JSON.stringify(newVal))
  } catch {
    newVal.pop()
    $q.notify({ color: 'negative', message: 'Storage Limit Exceeded! Notice image too large.', icon: 'error' })
  }
}, { deep: true })

watch(subjects, (newVal) => {
  try {
    localStorage.setItem('campus_subjects', JSON.stringify(newVal))
  } catch {
    newVal.pop()
    $q.notify({ color: 'negative', message: 'Storage Limit Exceeded!', icon: 'error' })
  }
}, { deep: true })

watch(team, (newVal) => {
  try {
    localStorage.setItem('campus_team', JSON.stringify(newVal))
  } catch {
    newVal.pop()
    $q.notify({ color: 'negative', message: 'Storage Limit Exceeded! Contributor photo is too large.', icon: 'error' })
  }
}, { deep: true })
watch(myUploads, (newVal) => {
  try {
    localStorage.setItem('campus_uploads', JSON.stringify(newVal))
  } catch (err) {
    console.error('Storage quota exceeded', err)
    newVal.pop() // remove the file that caused the overflow
    $q.notify({
      color: 'negative',
      message: 'Storage Limit Exceeded! Local Storage (5MB limit) is full. Try uploading a smaller file.',
      icon: 'error',
      timeout: 5000
    })
  }
}, { deep: true })


onMounted(() => {
  const storedUser = localStorage.getItem('campus_notes_admin')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
    if (isSuperAdmin.value) tab.value = 'notices'
    if (isSubAdmin.value) {
      tab.value = 'uploads'
      // Load current profile data
      const myData = team.value.find(t => t.id === currentUser.value.id)
      if (myData) {
        myProfile.value.photo = myData.photo
        // Don't prefill password for security
      }
    }
  } else {
    $router.push('/admin/login')
  }
})

// --- Columns ---
const noticeColumns = [
  { name: 'title', label: 'Notice Title', field: 'title', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'center' }
]
const subjectColumns = [
  { name: 'code', label: 'Subject Code', field: 'code', align: 'left' },
  { name: 'name', label: 'Subject Name', field: 'name', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'center' }
]
const teamColumns = [
  { name: 'photo', label: 'Photo', field: 'photo', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'username', label: 'Email', field: 'username', align: 'left' },
  { name: 'tag', label: 'Tag (Click to Edit)', field: 'tag', align: 'left' },
  { name: 'order', label: 'Order', field: 'order', align: 'center', sortable: true },
  { name: 'modules', label: 'Modules', field: 'modules', align: 'left' },
  { name: 'subjects', label: 'Subjects', field: 'subjects', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'center' }
]
const uploadColumns = [
  { name: 'title', label: 'Title', field: 'title', align: 'left' },
  { name: 'module', label: 'Module', field: 'module', align: 'left' },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'file', label: 'File', field: 'fileName', align: 'left' }
]

// --- Form States & Editing Logic ---
const editingId = ref(null)

const adminDialog = ref(false)
const newAdmin = ref({ name: '', username: '', password: '', photo: '', modules: [], subjects: [], tag: '', order: 3 })
const adminPhotoFile = ref(null)

const noticeDialog = ref(false)
const newNotice = ref({ title: '', type: 'Text', date: new Date().toISOString().split('T')[0], image: null })
const noticeFile = ref(null)

const subjectDialog = ref(false)
const newSubject = ref({ code: '', name: '' })

const uploadForm = ref({ subject: '', module: '', title: '' })
const uploadFile = ref(null)

const myProfile = ref({ password: '', photo: '' })
const myProfilePhotoFile = ref(null)

// --- Actions ---

function logout() {
  localStorage.removeItem('campus_notes_admin')
  $router.push('/admin/login')
  $q.notify({ message: 'Logged out successfully.', color: 'info', icon: 'info' })
}

function showAddDialog(type) {
  editingId.value = null
  if (type === 'notice') {
    newNotice.value = { title: '', type: 'Text', date: new Date().toISOString().split('T')[0], image: null }
    noticeFile.value = null
    noticeDialog.value = true
  } else if (type === 'subject') {
    newSubject.value = { code: '', name: '' }
    subjectDialog.value = true
  }
}

function editItem(type, row) {
  editingId.value = row.id
  if (type === 'notice') {
    newNotice.value = { ...row }
    noticeFile.value = null // reset file input since we don't load the file object back
    noticeDialog.value = true
  } else if (type === 'subject') {
    newSubject.value = { ...row }
    subjectDialog.value = true
  } else if (type === 'team') {
    newAdmin.value = { 
      ...row, 
      modules: row.modules ? row.modules.split(', ') : [], 
      subjects: row.subjects ? row.subjects.split(', ').map(s => subjects.value.find(sub => sub.code === s)?.code + ' - ' + subjects.value.find(sub => sub.code === s)?.name).filter(Boolean) : [] 
    }
    adminPhotoFile.value = null
    adminDialog.value = true
  }
}

function handleAdminPhotoUpload(file) {
  if (!file) {
    newAdmin.value.photo = null
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    newAdmin.value.photo = e.target.result // save as base64 string
  }
  reader.readAsDataURL(file)
}

function handleNoticeImageUpload(file) {
  if (!file) {
    newNotice.value.image = null
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    newNotice.value.image = e.target.result // save as base64 string
  }
  reader.readAsDataURL(file)
}

function saveNotice() {
  if (editingId.value) {
    const index = notices.value.findIndex(n => n.id === editingId.value)
    notices.value[index] = { ...newNotice.value, id: editingId.value }
    $q.notify({ color: 'positive', message: 'Notice updated.' })
  } else {
    notices.value.push({ ...newNotice.value, id: Date.now() })
    $q.notify({ color: 'positive', message: 'Notice added.' })
  }
  noticeDialog.value = false
}

function saveSubject() {
  if (editingId.value) {
    const index = subjects.value.findIndex(s => s.id === editingId.value)
    subjects.value[index] = { ...newSubject.value, id: editingId.value }
    $q.notify({ color: 'positive', message: 'Subject updated.' })
  } else {
    subjects.value.push({ ...newSubject.value, id: Date.now() })
    $q.notify({ color: 'positive', message: 'Subject added.' })
  }
  subjectDialog.value = false
}

function saveAdmin() {
  const adminData = {
    name: newAdmin.value.name,
    username: newAdmin.value.username,
    modules: newAdmin.value.modules.join(', '),
    subjects: newAdmin.value.subjects.map(s => s.split(' - ')[0]).join(', '),
    tag: newAdmin.value.tag,
    order: newAdmin.value.order,
    photo: newAdmin.value.photo || 'https://cdn.quasar.dev/img/avatar.png'
  }
  
  if (editingId.value) {
    const index = team.value.findIndex(t => t.id === editingId.value)
    team.value[index] = { ...adminData, id: editingId.value }
    $q.notify({ color: 'positive', message: 'Contributor updated!' })
  } else {
    team.value.push({ ...adminData, id: Date.now() })
    $q.notify({ color: 'positive', message: 'New Contributor added!' })
  }
  
  newAdmin.value = { name: '', username: '', password: '', photo: '', modules: [], subjects: [], tag: '', order: team.value.length + 1 }
  adminPhotoFile.value = null
  adminDialog.value = false
}

function deleteItem(type, id) {
  const isConfirmed = window.confirm('Are you sure you want to delete this item?')
  if (isConfirmed) {
    if (type === 'notice') notices.value = notices.value.filter(i => i.id !== id)
    else if (type === 'subject') subjects.value = subjects.value.filter(i => i.id !== id)
    else if (type === 'team') team.value = team.value.filter(i => i.id !== id)
    $q.notify({ color: 'negative', message: 'Item deleted.' })
  }
}

function handleUpload() {
  if (!uploadFile.value && !uploadForm.value.driveLink) {
    $q.notify({ color: 'negative', message: 'Please select a file to upload' })
    return
  }
  
  let fileType = 'Unknown'
  let fileName = ''
  
  if (uploadFile.value) {
    fileName = uploadFile.value.name
    const typeStr = uploadFile.value.type || ''
    if (typeStr.includes('pdf') || fileName.endsWith('.pdf')) fileType = 'PDF'
    else if (typeStr.includes('image') || fileName.endsWith('.jpg') || fileName.endsWith('.png')) fileType = 'Image'
    else if (typeStr.includes('zip') || fileName.endsWith('.zip')) fileType = 'ZIP'
    else if (typeStr.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) fileType = 'Document'
    
    const reader = new FileReader()
    reader.onload = (e) => {
      myUploads.value.push({
        id: Date.now(),
        uploaderName: currentUser.value.name,
        subject: uploadForm.value.subject,
        module: uploadForm.value.module,
        title: uploadForm.value.title || fileName,
        type: fileType,
        fileName: fileName,
        fileData: e.target.result // Base64
      })
      resetUploadForm()
    }
    reader.readAsDataURL(uploadFile.value)
  } else {
    // Fallback if they were using old code logic
    myUploads.value.push({
      id: Date.now(),
      uploaderName: currentUser.value.name,
      ...uploadForm.value
    })
    resetUploadForm()
  }
}

function resetUploadForm() {
  uploadForm.value.title = ''
  uploadFile.value = null
  $q.notify({ color: 'positive', message: 'Material successfully uploaded!', icon: 'cloud_done' })
}

function handleMyPhotoUpload(file) {
  if (!file) {
    // Cannot reset if they just cancel file select, just leave as is
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    myProfile.value.photo = e.target.result
  }
  reader.readAsDataURL(file)
}

function saveMyProfile() {
  const index = team.value.findIndex(t => t.id === currentUser.value.id)
  if (index !== -1) {
    if (myProfile.value.password) {
      team.value[index].password = myProfile.value.password
    }
    if (myProfile.value.photo) {
      team.value[index].photo = myProfile.value.photo
    }
    
    // Also update current user in local storage to reflect new photo instantly
    const updatedUser = { ...currentUser.value, photo: team.value[index].photo }
    localStorage.setItem('campus_notes_admin', JSON.stringify(updatedUser))
    currentUser.value = updatedUser
    
    $q.notify({ color: 'positive', message: 'Profile updated successfully!', icon: 'check_circle' })
    myProfile.value.password = ''
    myProfilePhotoFile.value = null
  }
}
</script>
