import { User } from 'lucide-react'
import { Link } from 'react-router'
import UDrive from '../../assets/udrive-roudend.png'

export function Header() {
  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow-sm border-b">
      <header className="flex items-center justify-between container px-4 mx-auto">
        <Link to="/">
          <img src={UDrive} className="w-32 object-contain" alt="Logo UDrive" />
        </Link>

        <Link to="/auth/sign-in">
          <div className="border-2 rounded-full p-1 border-gray-500 hover:border-primary group transition">
            <User className="group-hover:text-primary transition" />
          </div>
        </Link>
      </header>
    </div>
  )
}
