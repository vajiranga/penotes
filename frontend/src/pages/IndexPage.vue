<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    <!-- Hero / Welcome Section -->
    <div class="row q-mb-md q-mt-sm">
      <div class="col-12">
        <h4 class="text-weight-bold text-indigo-10 q-my-none">
          Welcome back, Student! 👋
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-sm">
          Select a module below to continue your studies.
        </p>
      </div>
    </div>

    <!-- Notice Board (Dynamic Carousel) -->
    <div class="row q-mb-xl">
      <div class="col-12">
        <q-card class="shadow-2" style="border-radius: 12px; overflow: hidden;">
          <q-carousel
            v-model="noticeSlide"
            transition-prev="scale"
            transition-next="scale"
            swipeable
            animated
            control-color="white"
            navigation
            padding
            arrows
            height="220px"
            class="bg-indigo-9 text-white shadow-1 rounded-borders"
            autoplay
            infinite
          >
            <q-carousel-slide 
              v-for="notice in notices" 
              :key="notice.id" 
              :name="notice.id"
              :img-src="notice.type === 'image' ? notice.image : ''"
              :class="['column', 'no-wrap', 'flex-center', 'text-center', notice.type === 'image' ? 'q-pa-none' : '']"
            >
              <!-- TEXT NOTICE LAYOUT -->
              <div v-if="notice.type !== 'image'" class="full-width">
                <q-icon v-if="notice.icon" :name="notice.icon" size="40px" class="q-mb-sm" />
                <div class="text-h4 text-weight-bold q-mb-sm">{{ notice.title }}</div>
                <div class="text-subtitle1">{{ notice.content }}</div>
                <div v-if="notice.date" class="text-caption q-mt-sm opacity-8">Posted: {{ notice.date }}</div>
              </div>
              
              <!-- IMAGE NOTICE LAYOUT (Caption at bottom) -->
              <div v-if="notice.type === 'image'" class="absolute-bottom custom-caption q-pa-sm q-px-md text-left">
                <div class="text-subtitle1 text-weight-bold">{{ notice.title }}</div>
                <div v-if="notice.date" class="text-caption opacity-8">Posted: {{ notice.date }}</div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="indigo" size="3em" />
    </div>

    <!-- Cards Grid Section -->
    <div v-else class="row q-col-gutter-lg">
      <div 
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="card in studyModules" 
        :key="card.id"
      >
        <!-- Clickable Card Component -->
        <q-card 
          class="study-card cursor-pointer q-hoverable" 
          v-ripple
          @click="handleCardClick(card)"
        >
          <span class="q-focus-helper"></span>
          
          <q-card-section class="q-pa-lg text-center">
            <!-- Dynamic Icon with Background -->
            <q-avatar :color="card.color + '-1'" :text-color="card.color" size="80px" class="q-mb-md shadow-1">
              <q-icon :name="card.icon" size="40px" />
            </q-avatar>
            
            <!-- Card Title & Description -->
            <div class="text-h6 text-weight-bold text-grey-9 q-mb-xs">{{ card.title }}</div>
            <div class="text-caption text-grey-6">{{ card.description }}</div>
          </q-card-section>
          
          <!-- Optional Action Bar -->
          <q-separator />
          <q-card-actions align="center" class="bg-grey-1">
            <q-btn flat :color="card.color" label="Open Module" icon-right="arrow_forward" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- End of Cards Section -->

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()

// State
const loading = ref(true)
const studyModules = ref([])

// Notice Board State
const noticeSlide = ref(1)
const notices = ref([])

// Simulate Backend Data Fetching
onMounted(() => {
  // We use a setTimeout to simulate an API call from your backend
  setTimeout(() => {
    
    // Load Notice Board Data
    const storedNotices = JSON.parse(localStorage.getItem('campus_notices'))
    if (storedNotices && storedNotices.length > 0) {
      notices.value = storedNotices.map(n => ({
        id: n.id,
        type: n.type?.toLowerCase() === 'image' ? 'image' : 'text',
        icon: 'campaign', // Default icon
        title: n.title,
        content: '', // Can be extended in dashboard later
        date: n.date,
        image: n.image || 'https://cdn.quasar.dev/img/parallax2.jpg' // Use uploaded image or default
      }))
    } else {
      notices.value = [
        { id: 1, type: 'text', icon: 'campaign', title: 'Welcome to Semester 2!', content: 'Make sure to check your updated timetables in the Kaveesh Web module.', date: 'Today' },
        { id: 2, type: 'image', image: 'https://cdn.quasar.dev/img/parallax2.jpg', title: 'Tech Symposium 2026', content: 'Join us at the main hall this Friday for an amazing event.', date: 'Yesterday' }
      ]
    }

    // Load Modules Data
    studyModules.value = [
      { id: 1, title: 'Mind Maps', icon: 'account_tree', color: 'blue', description: 'Visualize and connect your concepts' },
      { id: 2, title: 'Notes', icon: 'menu_book', color: 'orange', description: 'Read, write, and organize lecture notes' },
      { id: 3, title: 'Lab Reports', icon: 'science', color: 'green', description: 'Manage and submit your practicals' },
      { id: 4, title: 'Past Papers', icon: 'history_edu', color: 'purple', description: 'Prepare for your upcoming exams' },
      { id: 6, title: 'Our Social Media', icon: 'thumb_up', color: 'pink', description: 'Connect with us on social platforms' },
      { id: 5, title: 'Kaveesh Web', icon: 'public', color: 'teal', description: 'Assignment dates, Timetables & Gallery' },
      { id: 7, title: '57 Notes', icon: 'folder_shared', color: 'light-blue', description: 'Access Batch 57 Drive Folder' },
      { id: 8, title: '58 Notes', icon: 'folder_shared', color: 'indigo', description: 'Access Batch 58 Drive Folder' },
      { id: 9, title: 'About University', icon: 'account_balance', color: 'blue-grey', description: 'History & Specifications' }
    ]
    loading.value = false
  }, 600) // 600ms fake delay
})

// Action handler for cards
function handleCardClick(card) {
  // If the Notes card is clicked, navigate to the Notes module
  if (card.id === 2 || card.title === 'Notes') {
    $router.push('/notes')
    return
  }
  if (card.id === 6 || card.title === 'Our Social Media') {
    $router.push('/social-media')
    return
  }
  if (card.id === 5 || card.title === 'Kaveesh Web') {
    window.open('https://pe-24-25-live-assignment-deadlines.vercel.app/', '_blank')
    return
  }
  
  if (card.id === 3 || card.title === 'Lab Reports') {
    $router.push('/lab-reports')
    return
  }
  if (card.id === 4 || card.title === 'Past Papers') {
    $router.push('/past-papers')
    return
  }
  if (card.id === 7 || card.title === '57 Notes') {
    window.open('https://drive.google.com/drive/folders/1ozsYTgRuS2Ut7jUsTOy7MPruCRRz7GJE', '_blank')
    return
  }
  if (card.id === 8 || card.title === '58 Notes') {
    window.open('https://drive.google.com/drive/folders/dummy-link-58', '_blank')
    return
  }
  if (card.id === 9 || card.title === 'About University') {
    $router.push('/about')
    return
  }
  
  $q.notify({
    message: `Opening ${card.title}...`,
    color: card.color,
    icon: card.icon,
    position: 'top',
    timeout: 1500
  })
}
</script>

<style scoped>
/* Card Hover Elevation Effect */
.study-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.study-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  border-color: #e0e0e0;
}

.opacity-8 {
  opacity: 0.8;
}

/* Notice Image Caption */
.custom-caption {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
