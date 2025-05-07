import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { Router } from './router'
import { initAuthStoreListener } from './store/auth'

export function App() {
  // Inicializa o listener do Firebase
  useEffect(() => {
    initAuthStoreListener()
  }, [])

  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | UDrive" />
      <Toaster richColors />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  )
}
