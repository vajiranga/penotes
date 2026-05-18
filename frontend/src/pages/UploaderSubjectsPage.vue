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
                      <q-btn outline rounded color="indigo" icon="download" label="Get" size="sm" @click.stop="downloadNote(note)" />
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
  // Capture the ID from the URL (e.g. /notes/u1)
  const uploaderId = $route.params.uploaderId
  
  // Simulate fetching the uploader's subjects and notes from the Backend
  setTimeout(() => {
    
    // Fake database logic based on uploader ID
    if (uploaderId === 'u1') {
      uploaderName.value = 'Dr. Kasun Perera'
      subjects.value = [
        {
          id: 's1',
          name: 'Physics 101 (Mechanics)',
          notes: [
            { id: 'n1', title: 'Chapter 1: Kinematics Intro', type: 'pdf', date: 'Oct 01, 2025' },
            { id: 'n2', title: 'Chapter 2: Newton Laws', type: 'pdf', date: 'Oct 08, 2025' }
          ]
        },
        {
          id: 's2',
          name: 'Applied Mathematics',
          notes: [
            { id: 'n3', title: 'Calculus Summary', type: 'doc', date: 'Sep 15, 2025' }
          ]
        }
      ]
    } else {
      uploaderName.value = 'Amali Fernando'
      subjects.value = [
        {
          id: 's3',
          name: 'Computer Science Basics',
          notes: [
            { id: 'n4', title: 'Data Structures Cheat Sheet', type: 'pdf', date: 'Nov 10, 2025' },
            { id: 'n5', title: 'Algorithm Complexity', type: 'pdf', date: 'Nov 12, 2025' },
            { id: 'n6', title: 'Final Assignment Template', type: 'zip', date: 'Nov 20, 2025' }
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

function downloadNote(note) {
  $q.notify({
    message: `Starting download for ${note.title}...`,
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
