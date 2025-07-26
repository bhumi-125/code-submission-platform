import { defineStore } from 'pinia'
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs
} from 'firebase/firestore'

interface Submission {
  id: string
  userEmail: string
  userName: string
  code: string
  question: string
  submittedAt: Date
}

export const useSubmissionsStore = defineStore('submissions', () => {
  const { $firebase } = useNuxtApp()
  
  const submissions = ref<Submission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const submitCode = async (code: string, question: string, user: any) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Submitting code...', { code, question, user }) // Debug log
      
      const docRef = await addDoc(collection($firebase.firestore, 'submissions'), {
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        code,
        question,
        submittedAt: new Date()
      })
      
      console.log('Code submitted successfully with ID:', docRef.id) // Debug log
      
      // Add to local state immediately for better UX
      const newSubmission: Submission = {
        id: docRef.id,
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        code,
        question,
        submittedAt: new Date()
      }
      
      submissions.value.unshift(newSubmission)
      
    } catch (err: any) {
      console.error('Error submitting code:', err)
      error.value = err.message || 'Failed to submit code'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserSubmissions = async (userEmail: string) => {
    loading.value = true
    error.value = null
    
    try {
      const q = query(
        collection($firebase.firestore, 'submissions'),
        where('userEmail', '==', userEmail),
        orderBy('submittedAt', 'desc')
      )

      const snapshot = await getDocs(q)
      submissions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      })) as Submission[]
      
    } catch (err: any) {
      console.error('Error fetching user submissions:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchAllSubmissions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const q = query(
        collection($firebase.firestore, 'submissions'),
        orderBy('submittedAt', 'desc')
      )

      const snapshot = await getDocs(q)
      submissions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      })) as Submission[]
      
    } catch (err: any) {
      console.error('Error fetching all submissions:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Real-time listener for user submissions
  const listenToUserSubmissions = (userEmail: string) => {
    const q = query(
      collection($firebase.firestore, 'submissions'),
      where('userEmail', '==', userEmail),
      orderBy('submittedAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      submissions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      })) as Submission[]
    }, (err) => {
      console.error('Error listening to submissions:', err)
      error.value = err.message
    })
  }

  // Real-time listener for all submissions (admin)
  const listenToAllSubmissions = () => {
    const q = query(
      collection($firebase.firestore, 'submissions'),
      orderBy('submittedAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      submissions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt.toDate()
      })) as Submission[]
    }, (err) => {
      console.error('Error listening to all submissions:', err)
      error.value = err.message
    })
  }

  return {
    submissions: readonly(submissions),
    loading: readonly(loading),
    error: readonly(error),
    submitCode,
    fetchUserSubmissions,
    fetchAllSubmissions,
    listenToUserSubmissions,
    listenToAllSubmissions
  }
})