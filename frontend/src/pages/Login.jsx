import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)

      // Login
      const data = await loginUser(email, password)

      const token = data.access_token

      if (!token) {
        throw new Error('Access token was not returned by the server.')
      }

      // Save token
      localStorage.setItem('token', token)

      // Get logged-in user's details
      const response = await fetch(
        'http://127.0.0.1:8000/auth/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Unable to get user information.')
      }

      const currentUser = await response.json()

      // Update AuthContext
      setUser(currentUser)

      // Go to dashboard
      navigate('/dashboard', { replace: true })

    } catch (error) {
      console.error('Login error:', error)

      if (error.response) {
        setError(
          error.response.data?.detail ||
          'Invalid email or password.'
        )
      } else {
        setError(
          error.message ||
          'Unable to connect to the backend server.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            E
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Enterprise
          </h1>

          <p className="mt-1 text-slate-500">
            Knowledge Assistant
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your knowledge assistant.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <LogIn size={18} />

              {loading
                ? 'Signing in...'
                : 'Sign In'}

            </button>

          </form>

          {/* Register */}
          <div className="mt-6 text-center text-sm text-slate-500">

            Don't have an account?{' '}

            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login