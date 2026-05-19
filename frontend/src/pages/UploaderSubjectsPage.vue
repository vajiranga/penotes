<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-lg items-center">
      <q-btn flat round icon="arrow_back" color="indigo-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-indigo-10 q-my-none">
          {{ uploaderName }}'s Notes
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Explore subjects and download notes from this contributor.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="indigo" size="3em" />
    </div>

    <!-- Subjects List (Expansion Items) -->
    <div v-else class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        
        <q-list bordered class="rounded-borders bg-white shadow-1">
          
          <q-expansion-item
            v-for="subject in subjects"
            :key="subject.id"
            expand-separator
            icon="auto_stories"
            header-class="bg-indigo-1 text-indigo-10 text-weight-bold text-h6 q-pa-md"
            expand-icon-class="text-indigo-10"
            :label="subject.name"
            :caption="subject.notes.length + ' Notes Available'"
          >
            <!-- Notes inside the subject -->
            <q-card>
              <q-card-section class="q-pt-none q-px-none">
                <q-list separator>
                  <q-item 
                    v-for="note in subject.notes" 
                    :key="note.id" 
                    class="q-py-md q-px-lg hover-bg"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-avatar :color="getIconColor(note.type)" text-color="white" :icon="getFileIcon(note.type)" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-bold text-grey-9 text-subtitle1">{{ note.title }}</q-item-label>
                      <q-item-label caption class="text-grey-6">
                        Added on: {{ note.date }} &bull; {{ note.type.toUpperCase() }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="row q-gutter-xs">
                        <q-btn flat round color="indigo" icon="visibility" size="sm" @click.stop="viewFile(note)" tooltip="View" />
                        <q-btn flat round color="green" icon="download" size="sm" @click.stop="downloadFile(note)" tooltip="Download" />
                        <q-btn flat round color="orange" icon="share" size="sm" @click.stop="shareFile(note)" tooltip="Share" />
                      </div>
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="subject.notes.length === 0" class="q-py-lg">
                    <q-item-section class="text-center text-grey-6">
                      No notes uploaded for this subject yet.
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
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const uploaderName = ref('Contributor')
const subjects = ref([])

onMounted(() => {
  const uploaderId = $route.params.uploaderId
  
  setTimeout(() => {
    const team = JSON.parse(localStorage.getItem('campus_team')) || []
    const allSubjects = JSON.parse(localStorage.getItem('campus_subjects')) || []
    const allUploads = JSON.parse(localStorage.getItem('campus_uploads')) || []
    
    const member = team.find(t => String(t.id) === String(uploaderId))
    
    if (member) {
      uploaderName.value = member.name
      
      const assignedSubjectCodes = member.subjects ? member.subjects.split(',').map(s => s.trim()) : []
      
      subjects.value = assignedSubjectCodes.map(code => {
        const subjectDetails = allSubjects.find(s => s.code === code)
        const subjectName = subjectDetails ? subjectDetails.name : code
        
        // Filter uploads for this user and module = 'Notes'
        const uploaderNotes = allUploads.filter(u => u.uploaderName?.trim() === member.name?.trim() && u.module?.trim() === 'Notes')
        
        // Group by subject
        const notesForSubject = uploaderNotes
          .filter(u => u.subject && u.subject.includes(code))
          .map(u => {
            // format date from ID if available
            let dateStr = 'Recently'
            if (u.id && u.id > 10000) {
              const d = new Date(u.id)
              if (!isNaN(d)) dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }
            return {
              id: u.id,
              title: u.title || 'Untitled Note',
              type: u.type ? u.type.toLowerCase() : 'pdf',
              date: dateStr,
              driveLink: u.driveLink,
              fileData: u.fileData,
              fileName: u.fileName
            }
          }).reverse() // Newest first
        
        return {
          id: code,
          name: `${code} - ${subjectName}`,
          notes: notesForSubject
        }
      })
    } else {
      uploaderName.value = 'Unknown Contributor'
      subjects.value = []
    }
    
    loading.value = false
  }, 400)
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
