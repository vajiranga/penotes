<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    <!-- Header -->
    <div class="row q-mb-xl q-mt-sm items-center">
      <q-btn flat round icon="arrow_back" color="indigo-10" @click="$router.back()" class="q-mr-sm" />
      <div>
        <h4 class="text-weight-bold text-indigo-10 q-my-none">Meet the Admin Team</h4>
        <p class="text-subtitle1 text-grey-8 q-mt-sm q-mb-none">The dedicated people behind Campus Notes.</p>
      </div>
    </div>

    <!-- Admin Team Grid -->
    <div class="row q-col-gutter-lg justify-center q-mb-xl">
      <div class="col-12 col-sm-6 col-md-4" v-for="admin in adminTeam" :key="admin.id">
        <q-card class="admin-card text-center q-pa-md shadow-2 q-hoverable" v-ripple>
          <q-avatar size="100px" class="shadow-3 q-mb-md">
            <img :src="admin.avatar" />
          </q-avatar>
          <div class="text-h6 text-weight-bold text-indigo-10">{{ admin.name }}</div>
          <div class="text-subtitle2 text-grey-7">{{ admin.role }}</div>
          <q-card-actions align="center" class="q-mt-sm">
            <q-btn v-if="admin.phone" flat round color="green-6" icon="chat" type="a" :href="'https://wa.me/' + admin.phone" target="_blank">
              <q-tooltip>WhatsApp</q-tooltip>
            </q-btn>
            <q-btn v-else flat round color="grey-4" icon="chat" disable>
              <q-tooltip>No Contact Number</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const adminTeam = ref([])

onMounted(() => {
  const storedTeam = JSON.parse(localStorage.getItem('campus_team'))
  if (storedTeam && storedTeam.length > 0) {
    adminTeam.value = storedTeam.map(t => ({
      id: t.id,
      name: t.name,
      role: t.tag || t.modules || 'Admin Team',
      avatar: t.photo || 'https://cdn.quasar.dev/img/avatar.png',
      phone: t.phone ? t.phone.replace(/[^0-9]/g, '') : null
    }))
  } else {
    adminTeam.value = [
      { id: 1, name: 'Kaveesh', role: 'Founder & Lead Admin', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
      { id: 2, name: 'Vaji', role: 'Technical Lead', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' },
      { id: 3, name: 'Admin Team', role: 'Content Moderators', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' }
    ]
  }
})
</script>

<style scoped>
.admin-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}
.admin-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
  border-color: #e0e0e0;
}
</style>
