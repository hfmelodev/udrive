import { Route, Routes } from 'react-router'
import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { NotFound } from './not-found'
import { CarDetails } from './pages/car-details'
import { Dashboard } from './pages/dashboard'
import { Home } from './pages/home'
import { NewCar } from './pages/new-car'
import { Register } from './pages/register'
import { SignIn } from './pages/sign-in'

export function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-car" element={<NewCar />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index path="sign-in" element={<SignIn />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
