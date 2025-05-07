import { useAuthStore } from '@/store/auth'
import { LogInIcon, User } from 'lucide-react'
import { Link } from 'react-router'
import UDrive from '../../assets/udrive-roudend.png'

export function Header() {
  const { signedIn, loadingAuth, user } = useAuthStore()

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow-sm border-b">
      <header className="flex items-center justify-between container px-4 mx-auto">
        <Link to="/">
          <img src={UDrive} className="w-32 object-contain" alt="Logo UDrive" />
        </Link>

        {!loadingAuth && signedIn && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-sm font-medium flex items-center gap-1">
              Olá, <p className="text-primary">{user?.name}</p>
            </span>
            <div className="border-2 rounded-full p-1 border-gray-500 hover:border-primary group transition">
              <User className="group-hover:text-primary size-5 transition" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signedIn && (
          <Link to="/auth" className="flex items-center gap-2">
            <LogInIcon className="hover:text-primary transition" />
            <span className="text-sm font-medium text-primary">Entrar</span>
          </Link>
        )}
      </header>
    </div>
  )
}
