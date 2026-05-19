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
                      <div class="row q-gutter-xs">
                        <q-btn flat round color="green-8" icon="visibility" size="sm" @click.stop="viewFile(report)" tooltip="View" />
                        <q-btn flat round color="green" icon="download" size="sm" @click.stop="downloadFile(report)" tooltip="Download" />
                        <q-btn flat round color="orange" icon="share" size="sm" @click.stop="shareFile(report)" tooltip="Share" />
                      </div>
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
  setTimeout(() => {
    const allSubjects = JSON.parse(localStorage.getItem('campus_subjects')) || []
    const allUploads = JSON.parse(localStorage.getItem('campus_uploads')) || []
    
    if (allSubjects.length > 0) {
      subjects.value = allSubjects.map(s => {
        const reportsForSubject = allUploads
          .filter(u => u.module === 'Lab Reports' && u.subject && u.subject.includes(s.code))
          .map(u => {
            let dateStr = 'Recently'
            if (u.id && u.id > 10000) {
              const d = new Date(u.id)
              if (!isNaN(d)) dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
            return {
              id: u.id,
              title: u.title || 'Untitled Report',
              type: u.type ? u.type.toLowerCase() : 'pdf',
              date: dateStr,
              driveLink: u.driveLink,
              fileData: u.fileData,
              fileName: u.fileName
            }
          }).reverse()
          
        return {
          id: s.code,
          name: `${s.code} - ${s.name}`,
          reports: reportsForSubject
        }
      })
    } else {
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
          reports: []
        },
        {
          id: 's3',
          name: 'Computer Science Basics',
          reports: [
            { id: 'r3', title: 'Lab 1: Basic Algorithms', type: 'zip', date: 'Nov 15, 2025' }
          ]
        }
      ]
    }
    
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

function viewFile(file) {
  if (file.fileData) {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`<iframe src="${file.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`)
    }
  } else if (file.driveLink) {
    window.open(file.driveLink, '_blank')
  } else {
    $q.notify({ message: 'No file available to view.', color: 'warning', icon: 'warning' })
  }
}

function downloadFile(file) {
  if (file.fileData) {
    const link = document.createElement('a')
    link.href = file.fileData
    link.download = file.fileName || 'download'
    link.click()
  } else if (file.driveLink) {
    window.open(file.driveLink, '_blank')
  } else {
    $q.notify({ message: `No file available to download for ${file.title}.`, color: 'warning', icon: 'warning' })
  }
}

function shareFile(file) {
  $q.notify({
    message: `Share link copied for ${file.title || 'file'}! (Sharing large files will be available on live server)`,
    color: 'info',
    icon: 'share',
    position: 'bottom'
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
