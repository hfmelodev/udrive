import { Route, Routes } from 'react-router'
import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { PrivateRoute, PublicRoute } from './middleware'
import { NotFound } from './not-found'
import { Dashboard } from './pages/private/dashboard'
import { NewCar } from './pages/private/new-car'
import { CarDetails } from './pages/public/car-details'
import { Home } from './pages/public/home'
import { Register } from './pages/public/register'
import { SignIn } from './pages/public/sign-in'

export function Router() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-car"
          element={
            <PrivateRoute>
              <NewCar />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route
          index
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Route>

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
