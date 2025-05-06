import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  )
}
