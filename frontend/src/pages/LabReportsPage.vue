<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-lg items-center">
      <q-btn flat round icon="arrow_back" color="green-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-green-10 q-my-none">
          Lab Reports
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Browse and download practical lab reports by subject.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="green" size="3em" />
    </div>

    <!-- Subjects List (Expansion Items) -->
    <div v-else class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        
        <q-list bordered class="rounded-borders bg-white shadow-1">
          
          <q-expansion-item
            v-for="subject in subjects"
            :key="subject.id"
            expand-separator
            icon="science"
            header-class="bg-green-1 text-green-10 text-weight-bold text-h6 q-pa-md"
            expand-icon-class="text-green-10"
            :label="subject.name"
            :caption="subject.reports.length + ' Reports Available'"
          >
            <!-- Lab Reports inside the subject -->
            <q-card>
              <q-card-section class="q-pt-none q-px-none">
                <q-list separator>
                  <q-item 
                    v-for="report in subject.reports" 
                    :key="report.id" 
                    class="q-py-md q-px-lg hover-bg"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-avatar :color="getIconColor(report.type)" text-color="white" :icon="getFileIcon(report.type)" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold text-grey-9 text-subtitle1">{{ report.title }}</q-item-label>
                      <q-item-label caption class="text-grey-6">
                        Added on: {{ report.date }} &bull; {{ report.type.toUpperCase() }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn outline rounded color="green-7" icon="download" label="Get" size="sm" @click.stop="downloadFile(report)" />
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="subject.reports.length === 0" class="q-py-lg">
                    <q-item-section class="text-center text-grey-6">
                      No lab reports uploaded for this subject yet.
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>

        </q-list>

      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const subjects = ref([])

onMounted(() => {
  // Simulate fetching data from backend
  setTimeout(() => {
    subjects.value = [
      {
        id: 's1',
        name: 'Physics 101 (Mechanics)',
        reports: [
          { id: 'r1', title: 'Lab 1: Pendulum Motion', type: 'pdf', date: 'Oct 05, 2025' },
          { id: 'r2', title: 'Lab 2: Friction Coefficient', type: 'doc', date: 'Oct 12, 2025' }
        ]
      },
      {
        id: 's2',
        name: 'Applied Mathematics',
        reports: [] // No lab reports for math generally, but keeping the subject
      },
      {
        id: 's3',
        name: 'Computer Science Basics',
        reports: [
          { id: 'r3', title: 'Lab 1: Basic Algorithms', type: 'zip', date: 'Nov 15, 2025' }
        ]
      }
    ]
    
    loading.value = false
  }, 500)
})

// Helper UI functions
function getFileIcon(type) {
  if (type === 'pdf') return 'picture_as_pdf'
  if (type === 'doc') return 'description'
  if (type === 'zip') return 'folder_zip'
  return 'insert_drive_file'
}

function getIconColor(type) {
  if (type === 'pdf') return 'red-6'
  if (type === 'doc') return 'blue-6'
  if (type === 'zip') return 'orange-6'
  return 'grey-6'
}

function downloadFile(file) {
  $q.notify({
    message: `Starting download for ${file.title}...`,
    color: 'positive',
    icon: 'cloud_download',
    position: 'bottom',
    timeout: 2000
  })
}
</script>

<style scoped>
.hover-bg {
  transition: background-color 0.2s;
}
.hover-bg:hover {
  background-color: #f8f9fa;
}
</style>
