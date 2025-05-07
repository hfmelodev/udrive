import { Route, Routes } from 'react-router'
import { AppLayout } from './_layouts/app'
import { AuthLayout } from './_layouts/auth'
import { PrivateRoute, PublicRoute } from './middleware'
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
        <Route
          path="/car/:id"
          element={
            <PrivateRoute>
              <CarDetails />
            </PrivateRoute>
          }
        />
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
