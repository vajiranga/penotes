<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Premium Header -->
    <q-header elevated class="bg-indigo-9 text-white">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-weight-bold" style="font-size: 1.4rem;">
          <q-icon name="school" size="md" class="q-mr-sm" />
          Campus Notes
        </q-toolbar-title>

        <q-space />

        <!-- User Profile Action -->
        <q-btn flat round dense icon="notifications" class="q-mr-sm">
          <q-badge color="red" floating>3</q-badge>
        </q-btn>
        
        <q-avatar size="38px" class="cursor-pointer bg-white text-indigo-9 font-weight-bold">
          US
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup>
                <q-item-section avatar><q-icon name="person" /></q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar><q-icon name="logout" color="red" /></q-item-section>
                <q-item-section class="text-red">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <!-- Sidebar / Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <div class="q-pa-md text-center bg-indigo-1">
        <q-avatar size="72px" class="q-mb-sm shadow-2 bg-indigo-9 text-white">
          <q-icon name="local_library" />
        </q-avatar>
        <div class="text-weight-bold text-subtitle1">Study Portal</div>
        <div class="text-grey-7 text-caption">University Access</div>
      </div>

      <q-separator />

      <q-list padding class="text-grey-9">
        <q-item-label header class="text-weight-bolder text-uppercase text-indigo-9">
          Menu
        </q-item-label>

        <q-item clickable v-ripple active-class="bg-indigo-1 text-indigo-9" exact to="/">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Favorites</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Settings</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple class="text-red-9" to="/admin/login">
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" color="red-9" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Admin Portal</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- Page Transitions for smooth UX -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Global Floating Action Buttons -->
    <div class="fixed-bottom-right q-pa-lg" style="z-index: 1000;">
      <div class="column q-gutter-y-sm">
        <!-- Admin Request Button -->
        <q-btn round color="red-7" icon="admin_panel_settings" @click="openWhatsApp('admin')">
          <q-tooltip anchor="center left" self="center right" class="bg-red text-subtitle2">Request Admin</q-tooltip>
        </q-btn>
        <!-- Contact Us Button -->
        <q-btn round color="green-6" icon="chat" size="18px" @click="openWhatsApp('contact')">
          <q-tooltip anchor="center left" self="center right" class="bg-green text-subtitle2">WhatsApp Us</q-tooltip>
        </q-btn>
      </div>
    </div>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Global WhatsApp Action
function openWhatsApp(type) {
  const phone = '94754704699'
  let message = ''
  
  if (type === 'contact') {
    message = encodeURIComponent('Hello, I would like to contact you regarding Campus Notes.')
  } else if (type === 'admin') {
    message = encodeURIComponent('Hello, I would like to request Admin access for the Campus Notes platform.')
  }

  const url = `https://wa.me/${phone}?text=${message}`
  window.open(url, '_blank')
}
</script>

<style>
/* Simple fade transition for page routing */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
