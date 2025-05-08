import { auth } from '@/lib/firebase'
import type { User } from 'firebase/auth'
import { create } from 'zustand'

interface UserProps {
  uid: string
  name: string | null
  email: string | null
}

type AuthStore = {
  signedIn: boolean
  loadingAuth: boolean
  user: UserProps | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  signedIn: false,
  loadingAuth: true,
  user: null,
  setUser: user => {
    if (user) {
      set({
        signedIn: true,
        loadingAuth: false,
        user: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        },
      })
    } else {
      set({
        signedIn: false,
        loadingAuth: false,
        user: null,
      })
    }
  },
}))

// Inicializa a escuta do Firebase somente uma vez
let initialized = false

export const initAuthStoreListener = () => {
  if (initialized) {
    return
  }

  initialized = true

  auth.onAuthStateChanged(user => {
    // Atualiza o usuário no store se o usuário estiver logado
    useAuthStore.getState().setUser(user)
  })

  return () => {
    initialized = false // Limpa a flag de inicialização ao desmontar o componente
  }
}
