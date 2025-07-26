<template>
  <div class="min-h-screen bg-gray-50">
  
    <!-- Login Page -->
    <div v-if="!authStore.user" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div class="text-center mb-6">
          <div class="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold">Code Submission Platform</h1>
          <p class="text-gray-600">Choose how you'd like to access the platform</p>
        </div>

        <div class="space-y-4">
          <button
            @click="authStore.signInWithGoogle"
            :disabled="authStore.loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in with Google</span>
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            @click="authStore.signInAsVisitor"
            :disabled="authStore.loading"
            class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Continue as Visitor
          </button>
        </div>

        <div v-if="authStore.error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ authStore.error }}
        </div>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <VisitorDashboard v-if="!authStore.isAdmin" />
      <AdminDashboard v-else />
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>