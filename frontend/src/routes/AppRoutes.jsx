import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents'
import Chat from '../pages/Chat'
import AITools from '../pages/AITools'
import Profile from '../pages/Profile'
import Admin from '../pages/Admin'

import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../components/layout/MainLayout'

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Documents />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-tools"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AITools />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Admin />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes