<template>
  <div class="min-h-screen bg-cream-50 text-charcoal-900">
    <!-- Fixed Left Sidebar: Sticks permanently in position -->
    <AdminSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <!-- Main Content: Padded on desktop to avoid fixed sidebar overlap -->
    <div class="lg:pl-64 flex flex-col min-h-screen min-w-0 transition-all duration-300">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

export default {
  name: 'AdminLayout',
  components: {
    AdminSidebar,
    AdminHeader
  },
  data() {
    return {
      sidebarOpen: false
    }
  }
}
</script>
