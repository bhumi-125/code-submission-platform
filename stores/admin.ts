import { defineStore } from 'pinia'
import { 
  collection, 
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query 
} from 'firebase/firestore'

interface Admin {
  email: string
  addedAt: Date
}

export const useAdminStore = defineStore('admin', () => {
  const { $firebase } = useNuxtApp()
  
  const admins = ref<Admin[]>([])
  const loading = ref(false)

  const addAdmin = async (email: string) => {
    loading.value = true
    
    try {
      await setDoc(doc($firebase.firestore, 'admins', email), {
        email,
        addedAt: new Date(),
        isAdmin: true
      })
      
      // Add to local state
      admins.value.push({
        email,
        addedAt: new Date()
      })
    } catch (err) {
      console.error('Error adding admin:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeAdmin = async (email: string) => {
    loading.value = true
    
    try {
      await deleteDoc(doc($firebase.firestore, 'admins', email))
      
      // Remove from local state
      admins.value = admins.value.filter(admin => admin.email !== email)
    } catch (err) {
      console.error('Error removing admin:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAdmins = async () => {
    loading.value = true
    
    try {
      const q = query(collection($firebase.firestore, 'admins'))
      const snapshot = await getDocs(q)
      
      admins.value = snapshot.docs.map(doc => ({
        email: doc.id,
        addedAt: doc.data().addedAt.toDate()
      }))
    } catch (err) {
      console.error('Error fetching admins:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    admins: readonly(admins),
    loading: readonly(loading),
    addAdmin,
    removeAdmin,
    fetchAdmins
  }
})