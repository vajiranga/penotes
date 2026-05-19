<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-lg items-center">
      <q-btn flat round icon="arrow_back" color="purple-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-purple-10 q-my-none">
          Past Papers
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Prepare for exams with previous years' papers by subject.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="purple" size="3em" />
    </div>

    <!-- Subjects List (Expansion Items) -->
    <div v-else class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        
        <q-list bordered class="rounded-borders bg-white shadow-1">
          
          <q-expansion-item
            v-for="subject in subjects"
            :key="subject.id"
            expand-separator
            icon="history_edu"
            header-class="bg-purple-1 text-purple-10 text-weight-bold text-h6 q-pa-md"
            expand-icon-class="text-purple-10"
            :label="subject.name"
            :caption="subject.papers.length + ' Papers Available'"
          >
            <!-- Past Papers inside the subject -->
            <q-card>
              <q-card-section class="q-pt-none q-px-none">
                <q-list separator>
                  <q-item 
                    v-for="paper in subject.papers" 
                    :key="paper.id" 
                    class="q-py-md q-px-lg hover-bg"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-avatar :color="getIconColor(paper.type)" text-color="white" :icon="getFileIcon(paper.type)" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold text-grey-9 text-subtitle1">{{ paper.title }}</q-item-label>
                      <q-item-label caption class="text-grey-6">
                        Added on: {{ paper.date }} &bull; {{ paper.type.toUpperCase() }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="row q-gutter-xs">
                        <q-btn flat round color="purple" icon="visibility" size="sm" @click.stop="viewFile(paper)" tooltip="View" />
                        <q-btn flat round color="green" icon="download" size="sm" @click.stop="downloadFile(paper)" tooltip="Download" />
                        <q-btn flat round color="orange" icon="share" size="sm" @click.stop="shareFile(paper)" tooltip="Share" />
                      </div>
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="subject.papers.length === 0" class="q-py-lg">
                    <q-item-section class="text-center text-grey-6">
                      No past papers uploaded for this subject yet.
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
        const papersForSubject = allUploads
          .filter(u => u.module === 'Past Papers' && u.subject && u.subject.includes(s.code))
          .map(u => {
            let dateStr = 'Recently'
            if (u.id && u.id > 10000) {
              const d = new Date(u.id)
              if (!isNaN(d)) dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
            return {
              id: u.id,
              title: u.title || 'Untitled Paper',
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
          papers: papersForSubject
        }
      })
    } else {
      subjects.value = [
        {
          id: 's1',
          name: 'Physics 101 (Mechanics)',
          papers: [
            { id: 'p1', title: '2022 Final Exam Paper', type: 'pdf', date: 'Jan 10, 2023' },
            { id: 'p2', title: '2023 Mid Term Paper', type: 'pdf', date: 'Jun 15, 2023' }
          ]
        },
        {
          id: 's2',
          name: 'Applied Mathematics',
          papers: [
            { id: 'p3', title: '2024 Model Paper', type: 'pdf', date: 'Mar 01, 2025' }
          ]
        },
        {
          id: 's3',
          name: 'Computer Science Basics',
          papers: [
            { id: 'p4', title: '2021 Final Exam', type: 'pdf', date: 'Jan 20, 2022' },
            { id: 'p5', title: '2022 Final Exam', type: 'pdf', date: 'Jan 15, 2023' }
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
