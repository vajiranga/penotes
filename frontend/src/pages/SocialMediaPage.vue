<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Header Section -->
    <div class="row q-mb-xl items-center">
      <q-btn flat round icon="arrow_back" color="indigo-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-indigo-10 q-my-none">
          Our Social Media
        </h4>
        <p class="text-subtitle1 text-grey-8 q-mt-xs q-mb-none">
          Connect with us across all platforms to stay updated!
        </p>
      </div>
    </div>

    <!-- Social Media Links Grid -->
    <div class="row q-col-gutter-lg justify-center">
      
      <!-- Facebook Card -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="social-card facebook cursor-pointer q-hoverable" v-ripple @click="openLink('https://facebook.com')">
          <q-card-section class="q-pa-lg text-center text-white">
            <q-icon name="facebook" size="60px" class="q-mb-md" />
            <div class="text-h5 text-weight-bold">Facebook</div>
            <div class="text-caption q-mt-sm opacity-8">Follow our official page</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Instagram Card -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="social-card instagram cursor-pointer q-hoverable" v-ripple @click="openLink('https://instagram.com')">
          <q-card-section class="q-pa-lg text-center text-white">
            <q-icon name="photo_camera" size="60px" class="q-mb-md" />
            <div class="text-h5 text-weight-bold">Instagram</div>
            <div class="text-caption q-mt-sm opacity-8">See our latest moments</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- TikTok Card -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="social-card tiktok cursor-pointer q-hoverable" v-ripple @click="openLink('https://tiktok.com')">
          <q-card-section class="q-pa-lg text-center text-white">
            <q-icon name="music_video" size="60px" class="q-mb-md" />
            <div class="text-h5 text-weight-bold">TikTok</div>
            <div class="text-caption q-mt-sm opacity-8">Watch fun and educational clips</div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
function openLink(url) {
  window.open(url, '_blank')
}
</script>

<style scoped>
.social-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  height: 100%;
}
.social-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
}

.opacity-8 {
  opacity: 0.8;
}

/* Custom Gradients for Social Media Brands */
.facebook {
  background: linear-gradient(135deg, #1877F2 0%, #0d5bbd 100%);
}
.instagram {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}
.tiktok {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
}
</style>
