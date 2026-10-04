import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

import { registerUser } from '../services/authService'

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)

      await registerUser(
        fullName,
        email,
        password,
      )

      setSuccess(
        'Account created successfully. Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {

      if (error.response) {
        setError(
          error.response.data?.detail ||
          'Registration failed. Please try again.'
        )
      } else {
        setError(
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

        {/* Logo / Title */}
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

        {/* Register Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Create an account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Register to access your knowledge assistant.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>

              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

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
                placeholder="Create a password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <UserPlus size={18} />

              {loading
                ? 'Creating account...'
                : 'Create Account'}

            </button>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-slate-500">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register