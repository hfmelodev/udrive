import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { Router } from './router'

export function App() {
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
