<template>
  <div>
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h1 class="text-xl font-semibold text-gray-900">Code Platform</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center gap-3">
              <img
                v-if="authStore.user?.photoURL"
                :src="authStore.user.photoURL"
                :alt="authStore.user.displayName"
                class="w-8 h-8 rounded-full"
              />
              <div class="text-sm">
                <p class="font-medium">{{ authStore.user?.displayName }}</p>
                <p class="text-gray-500">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <button
              @click="authStore.logout"
              class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- Current Question -->
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              Programming Challenge
            </h3>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p class="font-medium text-blue-800">{{ currentQuestion }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                  Your Solution:
                </label>
                <textarea
                  id="code"
                  v-model="code"
                  placeholder="// Write your code here...
function printFirst100Primes() {
    // Your implementation here
}"
                  class="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submissionsStore.loading || !code.trim()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg v-if="submissionsStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submissionsStore.loading ? 'Submitting...' : 'Submit Solution' }}
              </button>
            </form>

            <!-- Success/Error Messages -->
            <div v-if="submitMessage" class="mt-4 p-3 rounded" :class="submitMessage.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'">
              {{ submitMessage.text }}
            </div>
          </div>
        </div>

        <!-- User's Previous Submissions -->
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Your Submissions ({{ userSubmissions.length }})
            </h3>
            
            <div v-if="submissionsStore.loading && userSubmissions.length === 0" class="text-center py-8">
              <svg class="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-500">Loading your submissions...</p>
            </div>
            
            <div v-else-if="userSubmissions.length === 0" class="text-center py-8">
              <p class="text-gray-500">No submissions yet. Submit your first solution above!</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="submission in userSubmissions"
                :key="submission.id"
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {{ formatDate(submission.submittedAt) }}
                  </span>
                </div>
                <pre class="bg-gray-50 p-3 rounded text-sm overflow-x-auto"><code>{{ submission.code }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const submissionsStore = useSubmissionsStore()

const code = ref('')
const currentQuestion = 'Write a function to print the first 100 prime numbers.'
const submitMessage = ref(null)

const userSubmissions = computed(() => {
  return submissionsStore.submissions.filter(sub => sub.userEmail === authStore.user?.email)
})

const handleSubmit = async () => {
  if (!code.value.trim()) {
    submitMessage.value = {
      type: 'error',
      text: 'Please enter your code solution.'
    }
    return
  }

  if (!authStore.user) {
    submitMessage.value = {
      type: 'error',
      text: 'You must be logged in to submit code.'
    }
    return
  }

  try {
    console.log('Submitting code for user:', authStore.user.email) // Debug log
    
    await submissionsStore.submitCode(code.value.trim(), currentQuestion, authStore.user)
    
    code.value = ''
    submitMessage.value = {
      type: 'success',
      text: 'Code submitted successfully!'
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      submitMessage.value = null
    }, 3000)
    
  } catch (error) {
    console.error('Error submitting code:', error)
    submitMessage.value = {
      type: 'error',
      text: 'Failed to submit code. Please try again.'
    }
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

// Fetch user submissions when component mounts
onMounted(async () => {
  if (authStore.user?.email) {
    console.log('Fetching submissions for:', authStore.user.email) // Debug log
    try {
      await submissionsStore.fetchUserSubmissions(authStore.user.email)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }
})

// Watch for user changes
watch(() => authStore.user, (newUser) => {
  if (newUser?.email) {
    submissionsStore.fetchUserSubmissions(newUser.email)
  }
})
</script>