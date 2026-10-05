<template>
  <div id="app-root" class="min-h-screen">
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import ToastContainer from '@/components/common/ToastContainer.vue'

export default {
  name: 'App',
  components: {
    ToastContainer
  },
  created() {
    this.$store.dispatch('settings/fetchSettings')
    this.$store.dispatch('customers/fetchCustomers')
  }
}
</script>
