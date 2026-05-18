<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-2">
    
    <!-- Dashboard Header -->
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <h4 class="text-weight-bold text-grey-9 q-my-none">
          Admin Dashboard
        </h4>
        <p class="text-subtitle1 text-grey-6 q-mt-xs q-mb-none">
          Manage system data, contributors, and notices.
        </p>
      </div>
      <q-btn color="negative" icon="logout" label="Logout" @click="logout" outline />
    </div>

    <!-- Quick Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card class="bg-indigo-9 text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center">
            <q-icon name="campaign" size="40px" class="q-mr-md opacity-8" />
            <div>
              <div class="text-h4 text-weight-bold">5</div>
              <div class="text-subtitle2">Active Notices</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-green-8 text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center">
            <q-icon name="people" size="40px" class="q-mr-md opacity-8" />
            <div>
              <div class="text-h4 text-weight-bold">12</div>
              <div class="text-subtitle2">Contributors</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-orange-8 text-white shadow-2" style="border-radius: 12px;">
          <q-card-section class="row items-center">
            <q-icon name="menu_book" size="40px" class="q-mr-md opacity-8" />
            <div>
              <div class="text-h4 text-weight-bold">28</div>
              <div class="text-subtitle2">Subjects Configured</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Management Area (Tabs) -->
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
        <q-tab name="notices" icon="campaign" label="Notice Board" />
        <q-tab name="contributors" icon="manage_accounts" label="Contributors" />
        <q-tab name="subjects" icon="class" label="Subjects" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        
        <!-- Notices Tab -->
        <q-tab-panel name="notices" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-bold">Manage Notices</div>
            <q-btn color="indigo" icon="add" label="Add Notice" @click="showAddDialog('notice')" />
          </div>
          <q-table
            flat bordered
            :rows="notices"
            :columns="noticeColumns"
            row-key="id"
            hide-pagination
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="blue" icon="edit" size="sm" />
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('notice', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Contributors Tab -->
        <q-tab-panel name="contributors" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-bold">Manage Contributors & Tags</div>
            <q-btn color="indigo" icon="add" label="Add Contributor" @click="showAddDialog('contributor')" />
          </div>
          <p class="text-grey-7">Set the display order (1 is first) and assign custom tags like "Highly Recommended".</p>
          <q-table
            flat bordered
            :rows="contributors"
            :columns="contributorColumns"
            row-key="id"
            hide-pagination
          >
            <!-- Editable Order Column -->
            <template v-slot:body-cell-order="props">
              <q-td :props="props">
                {{ props.row.order }}
                <q-popup-edit v-model="props.row.order" title="Update Order" buttons v-slot="scope">
                  <q-input type="number" v-model="scope.value" dense autofocus />
                </q-popup-edit>
              </q-td>
            </template>
            <!-- Editable Tag Column -->
            <template v-slot:body-cell-tag="props">
              <q-td :props="props">
                <q-chip v-if="props.row.tag" color="orange" text-color="white" size="sm">{{ props.row.tag }}</q-chip>
                <span v-else class="text-grey italic">No Tag</span>
                <q-popup-edit v-model="props.row.tag" title="Update Tag" buttons v-slot="scope">
                  <q-input v-model="scope.value" dense autofocus hint="e.g. Highly Recommended" />
                </q-popup-edit>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('contributor', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Subjects Tab -->
        <q-tab-panel name="subjects" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-bold">Manage Subjects</div>
            <q-btn color="indigo" icon="add" label="Add Subject" @click="showAddDialog('subject')" />
          </div>
          <q-table
            flat bordered
            :rows="subjects"
            :columns="subjectColumns"
            row-key="id"
            hide-pagination
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="blue" icon="edit" size="sm" />
                <q-btn flat round color="red" icon="delete" size="sm" @click="deleteItem('subject', props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $router = useRouter()
const $q = useQuasar()

const tab = ref('notices')

// --- Mock Data ---

const notices = ref([
  { id: 1, title: 'Welcome to Semester 2!', type: 'Text', date: '2026-05-18' },
  { id: 2, title: 'Tech Symposium 2026', type: 'Image', date: '2026-05-17' }
])
const noticeColumns = [
  { name: 'title', label: 'Notice Title', field: 'title', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'left' },
  { name: 'date', label: 'Date Posted', field: 'date', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const contributors = ref([
  { id: 1, name: 'Dr. Kasun Perera', tag: 'Highly Recommended', order: 1 },
  { id: 2, name: 'Amali Fernando', tag: 'Top Contributor', order: 2 },
  { id: 3, name: 'Nishantha Kumara', tag: '', order: 4 },
])
const contributorColumns = [
  { name: 'name', label: 'Contributor Name', field: 'name', align: 'left' },
  { name: 'tag', label: 'Custom Tag (Click to edit)', field: 'tag', align: 'left' },
  { name: 'order', label: 'Display Order (Click to edit)', field: 'order', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const subjects = ref([
  { id: 1, name: 'Physics 101 (Mechanics)', code: 'PHY101' },
  { id: 2, name: 'Applied Mathematics', code: 'MAT201' },
  { id: 3, name: 'Computer Science Basics', code: 'CSC101' }
])
const subjectColumns = [
  { name: 'code', label: 'Subject Code', field: 'code', align: 'left' },
  { name: 'name', label: 'Subject Name', field: 'name', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'center' }
]

// --- Actions ---

function logout() {
  $router.push('/admin/login')
  $q.notify({
    message: 'Logged out successfully.',
    color: 'info',
    icon: 'info'
  })
}

function showAddDialog(type) {
  let title = ''
  let label = ''

  if (type === 'notice') {
    title = 'Add New Notice'
    label = 'Notice Title'
  } else if (type === 'contributor') {
    title = 'Add Contributor'
    label = 'Contributor Name'
  } else if (type === 'subject') {
    title = 'Add Subject'
    label = 'Subject Name'
  }

  $q.dialog({
    title: title,
    message: `Enter the ${label.toLowerCase()}:`,
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    if (!data) return
    const id = Date.now()
    
    if (type === 'notice') {
      notices.value.push({ id, title: data, type: 'Text', date: new Date().toISOString().split('T')[0] })
    } else if (type === 'contributor') {
      contributors.value.push({ id, name: data, tag: '', order: contributors.value.length + 1 })
    } else if (type === 'subject') {
      subjects.value.push({ id, name: data, code: 'NEW101' })
    }
    
    $q.notify({ color: 'positive', message: `${title} successfully added.`, icon: 'check_circle' })
  })
}

function deleteItem(type, id) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this item?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    if (type === 'notice') {
      notices.value = notices.value.filter(item => item.id !== id)
    } else if (type === 'contributor') {
      contributors.value = contributors.value.filter(item => item.id !== id)
    } else if (type === 'subject') {
      subjects.value = subjects.value.filter(item => item.id !== id)
    }
    $q.notify({ color: 'negative', message: 'Item deleted.', icon: 'delete' })
  })
}
</script>

<style scoped>
.opacity-8 {
  opacity: 0.8;
}
</style>
