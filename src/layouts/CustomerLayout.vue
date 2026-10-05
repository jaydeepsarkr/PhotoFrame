<template>
  <div class="min-h-screen flex flex-col bg-cream-50 text-charcoal-900">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'

export default {
  name: 'CustomerLayout',
  components: {
    Navbar,
    Footer
  }
}
</script>
