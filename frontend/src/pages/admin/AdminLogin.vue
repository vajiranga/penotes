<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="shadow-4" style="width: 100%; max-width: 400px; border-radius: 12px;">
      
      <!-- Card Header -->
      <q-card-section class="bg-indigo-9 text-white text-center q-pa-lg">
        <q-icon name="admin_panel_settings" size="60px" class="q-mb-sm" />
        <div class="text-h5 text-weight-bold">Admin Portal</div>
        <div class="text-subtitle2 text-indigo-2">Login to manage Campus Notes</div>
      </q-card-section>

      <!-- Login Form -->
      <q-card-section class="q-pa-lg">
        <q-form @submit="handleLogin" class="q-gutter-md">
          
          <q-input 
            v-model="username" 
            filled 
            label="Username" 
            prepend-icon="person"
            :rules="[val => !!val || 'Username is required']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input 
            v-model="password" 
            filled 
            type="password" 
            label="Password" 
            hint="For old default accounts, use 123456"
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <div class="row justify-between items-center q-mt-md">
            <q-checkbox v-model="remember" label="Remember me" color="indigo" />
            <a href="#" class="text-indigo text-caption" style="text-decoration: none;">Forgot Password?</a>
          </div>

          <q-btn 
            type="submit" 
            color="indigo-9" 
            class="full-width q-mt-lg q-py-sm text-weight-bold" 
            label="SECURE LOGIN" 
            :loading="loading"
          />
          
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $router = useRouter()
const $q = useQuasar()

const username = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)

function handleLogin() {
  loading.value = true
  
  // Simulate network delay
  setTimeout(() => {
    loading.value = false
    
    const team = JSON.parse(localStorage.getItem('campus_team')) || [
      { id: 1, name: 'Dr. Kasun Perera', username: 'kasun@admin.com', tag: 'Highly Recommended', order: 1, modules: 'Notes', subjects: 'PHY101', photo: 'https://cdn.quasar.dev/img/avatar2.jpg' },
      { id: 2, name: 'Amali Fernando', username: 'amali@admin.com', tag: 'Top Contributor', order: 2, modules: 'Lab Reports', subjects: 'MAT201', photo: 'https://cdn.quasar.dev/img/avatar3.jpg' }
    ]
    
    // Check if user exists. If they don't have a password (old default accounts), allow '123456'
    const user = team.find(t => t.username === username.value && 
      (t.password === password.value || (!t.password && password.value === '123456'))
    )
    
    // Check credentials
    if (username.value === 'admin' && password.value === 'admin') {
      localStorage.setItem('campus_notes_admin', JSON.stringify({
        role: 'superadmin',
        name: 'Super Admin'
      }))
      $q.notify({ color: 'positive', position: 'top', message: 'Welcome Super Admin!', icon: 'shield' })
      $router.push('/admin/dashboard')
      
    } else if (user) {
      // Sub-admin login
      localStorage.setItem('campus_notes_admin', JSON.stringify({
        role: 'subadmin',
        id: user.id,
        name: user.name,
        username: user.username,
        photo: user.photo,
        modules: user.modules ? user.modules.split(',').map(m => m.trim()) : [],
        subjects: user.subjects ? user.subjects.split(',').map(s => s.trim()) : []
      }))
      $q.notify({ color: 'positive', position: 'top', message: `Welcome ${user.name}!`, icon: 'person' })
      $router.push('/admin/dashboard')
      
    } else {
      $q.notify({ color: 'negative', position: 'top', message: 'Invalid Username or Password.', icon: 'error' })
    }
  }, 800)
}
</script>
