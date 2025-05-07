import { Loading } from '@/components/app/loading'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from './store/auth'

type RouteProps = {
  children: ReactNode
}

export function PrivateRoute({ children }: RouteProps) {
  const { signedIn, loadingAuth } = useAuthStore()

  if (loadingAuth) {
    return <Loading isLoading={loadingAuth} />
  }

  if (!signedIn) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export function PublicRoute({ children }: RouteProps) {
  const { signedIn, loadingAuth } = useAuthStore()

  if (loadingAuth) {
    return <Loading isLoading={loadingAuth} />
  }

  if (signedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
