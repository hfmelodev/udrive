import { Header } from '@/components/app/header'
import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 antialiased">
      <Header />

      <div className="flex flex-col container mx-auto flex-1 px-4 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
