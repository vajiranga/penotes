const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'notes', component: () => import('pages/NotesUploadersPage.vue') },
      { path: 'notes/:uploaderId', component: () => import('pages/UploaderSubjectsPage.vue') },
      { path: 'social-media', component: () => import('pages/SocialMediaPage.vue') },
      { path: 'lab-reports', component: () => import('pages/LabReportsPage.vue') },
      { path: 'past-papers', component: () => import('pages/PastPapersPage.vue') },
      { path: 'about', component: () => import('pages/AboutUniversityPage.vue') },
      { path: 'team', component: () => import('pages/AboutTeamPage.vue') }
    ]
  },
  
  // Admin Routes (Using a blank layout or same layout depending on preference)
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'), // Using same layout for simplicity, or we can use a blank one. Let's use blank for login.
    children: [
      { path: 'login', component: () => import('pages/admin/AdminLogin.vue') },
      { path: 'dashboard', component: () => import('pages/admin/AdminDashboard.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
