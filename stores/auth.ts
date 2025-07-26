import { defineStore } from 'pinia'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  type User 
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const { $firebase } = useNuxtApp()
  
  const user = ref<User | null>(null)
  const loading = ref(false)
  const isAdmin = ref(false)
  const error = ref<string | null>(null)

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup($firebase.auth, provider)
      user.value = result.user
      await checkAdminStatus(result.user.email!)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const signInAsVisitor = async () => {
    loading.value = true
    
    try {
      // Create a mock visitor user
      const visitorUser = {
        uid: 'visitor-' + Date.now(),
        email: 'visitor@example.com',
        displayName: 'Visitor User',
        photoURL: null
      } as User
      
      user.value = visitorUser
      isAdmin.value = false
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (user.value?.email !== 'visitor@example.com') {
        await signOut($firebase.auth)
      }
      user.value = null
      isAdmin.value = false
    } catch (err: any) {
      error.value = err.message
    }
  }

  const checkAdminStatus = async (email: string) => {
    try {
      const adminDoc = await getDoc(doc($firebase.firestore, 'admins', email))
      isAdmin.value = adminDoc.exists()
    } catch (err) {
      isAdmin.value = false
    }
  }

  const initAuth = () => {
    onAuthStateChanged($firebase.auth, async (authUser) => {
      if (authUser) {
        user.value = authUser
        await checkAdminStatus(authUser.email!)
      } else {
        user.value = null
        isAdmin.value = false
      }
    })
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAdmin: readonly(isAdmin),
    error: readonly(error),
    signInWithGoogle,
    signInAsVisitor,
    logout,
    initAuth
  }
})