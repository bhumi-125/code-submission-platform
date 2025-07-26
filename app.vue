<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>