import { auth } from '@/lib/firebase'
import { Car, Home, LogOut, TvMinimal } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'

export function Panel() {
  async function handleLogout() {
    try {
      await auth.signOut()

      toast.success('Logout realizado com sucesso', {
        description: 'Volte sempre que quiser!',
      })
    } catch (err) {
      console.log(err)
      toast.error('Não foi possível fazer logout', {
        description: 'Tente novamente ou entre em contato com o suporte',
      })
    }
  }
  return (
    <div className="container flex items-center justify-between px-4 mx-auto h-10 bg-primary rounded-md">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          to="/"
          className="text-sm text-gray-200 font-medium flex items-center justify-center gap-1.5 transition hover:text-white"
        >
          <Home className="size-4" />
          Home
        </Link>

        <Link
          to="/dashboard"
          className="text-sm text-gray-200 font-medium flex items-center justify-center gap-1.5 transition hover:text-white"
        >
          <TvMinimal className="size-4" />
          Dashboard
        </Link>

        <Link
          to="/new-car"
          className="text-sm text-gray-200 font-medium flex items-center justify-center gap-1.5 transition hover:text-white"
        >
          <Car className="size-5" />
          Novo Carro
        </Link>
      </div>

      <Link
        to="/dashboard"
        className="text-sm text-gray-200 font-medium flex items-center justify-center gap-1.5 transition hover:text-red-400"
        onClick={handleLogout}
      >
        <LogOut className="size-5" />
        <span className="hidden sm:block">Sair da conta</span>
      </Link>
    </div>
  )
}
