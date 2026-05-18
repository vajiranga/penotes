<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-lg items-center">
      <q-btn flat round icon="arrow_back" color="indigo-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-indigo-10 q-my-none">
          Notes Contributors
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Select a trusted contributor to view their subjects and notes.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="indigo" size="3em" />
    </div>

    <!-- Uploaders Grid -->
    <div v-else class="row q-col-gutter-lg">
      <div 
        class="col-12 col-sm-6 col-md-4"
        v-for="uploader in sortedUploaders" 
        :key="uploader.id"
      >
        <q-card 
          class="uploader-card cursor-pointer q-hoverable" 
          v-ripple
          @click="selectUploader(uploader.id)"
        >
          <!-- Optional Admin Tag (e.g. Highly Recommended) -->
          <q-chip 
            v-if="uploader.tag" 
            square 
            color="orange-9" 
            text-color="white" 
            icon="star" 
            class="absolute-top-right z-top shadow-2 text-weight-bold"
            style="top: -12px; right: -12px; border-radius: 4px;"
          >
            {{ uploader.tag }}
          </q-chip>

          <q-card-section class="q-pa-lg row items-center no-wrap">
            <q-avatar size="70px" color="indigo-1" text-color="indigo-9" class="q-mr-md shadow-1 font-weight-bold">
              <!-- Initials as fallback if no image -->
              {{ uploader.name.charAt(0) }}
            </q-avatar>
            
            <div>
              <div class="text-h6 text-weight-bold text-grey-9 q-mb-xs" style="line-height: 1.2;">
                {{ uploader.name }}
              </div>
              <div class="text-caption text-grey-6 text-weight-medium">
                <q-icon name="library_books" size="xs" class="q-mr-xs" />
                {{ uploader.subjectsCount }} Subjects Available
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()
const loading = ref(true)

// Dummy data simulating what the Admin sets in the Backend
const uploaders = ref([])

onMounted(() => {
  setTimeout(() => {
    uploaders.value = [
      { 
        id: 'u1', 
        name: 'Dr. Kasun Perera', 
        tag: 'Highly Recommended', 
        order: 1, // Admin ordering
        subjectsCount: 4 
      },
      { 
        id: 'u2', 
        name: 'Amali Fernando', 
        tag: 'Top Contributor', 
        order: 2, 
        subjectsCount: 6 
      },
      { 
        id: 'u3', 
        name: 'Nishantha Kumara', 
        tag: '', // No tag
        order: 4, 
        subjectsCount: 2 
      },
      { 
        id: 'u4', 
        name: 'Prof. Senanayake', 
        tag: 'Official', 
        order: 3, 
        subjectsCount: 1 
      }
    ]
    loading.value = false
  }, 400)
})

// Sort the uploaders based on the 'order' field provided by admin backend
const sortedUploaders = computed(() => {
  return [...uploaders.value].sort((a, b) => a.order - b.order)
})

function selectUploader(id) {
  $router.push(`/notes/${id}`)
}
</script>

<style scoped>
.uploader-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.uploader-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
  border-color: #d0d0d0;
}
</style>
