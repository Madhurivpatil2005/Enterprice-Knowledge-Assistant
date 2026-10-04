import { useEffect, useState } from 'react'

import {
  User,
  Mail,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  CircleUserRound,
} from 'lucide-react'

import { getCurrentUser } from '../services/authService'

function Profile() {
  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  // ==================================================
  // LOAD PROFILE
  // ==================================================

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const data =
        await getCurrentUser()

      setUser(data)
    } catch (error) {
      console.error(
        'Profile loading error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to load profile.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // ==================================================
  // USER DATA
  // ==================================================

  const displayName =
    user?.full_name || 'User'

  const initial =
    displayName
      .charAt(0)
      .toUpperCase()

  const isAdmin =
    user?.role === 'admin'

  const roleLabel =
    isAdmin
      ? 'Administrator'
      : 'User'

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 pb-8">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative p-6 sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">

              <CircleUserRound
                size={25}
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Profile
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                View your account information
                and account role.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm">

          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-xs">
            !
          </span>

          <div>

            <p className="font-semibold">
              Unable to load profile
            </p>

            <p className="mt-0.5 text-xs leading-5 text-red-600">
              {error}
            </p>

          </div>

        </div>

      )}


      {/* ==================================================
          PROFILE OVERVIEW
      ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="relative border-b border-slate-100 px-6 py-7 sm:px-8">

          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-violet-500" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-4xl font-bold text-white shadow-lg shadow-blue-600/20 ring-4 ring-white">

                {loading
                  ? '...'
                  : initial}

              </div>

              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">

                <CheckCircle2
                  size={14}
                  className="text-white"
                />

              </span>

            </div>


            {/* USER INFORMATION */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="truncate text-2xl font-bold text-slate-900">

                  {loading
                    ? 'Loading...'
                    : displayName}

                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Active

                </span>

              </div>

              <p className="mt-1.5 text-sm text-slate-500">
                Enterprise Knowledge Assistant User
              </p>


              {/* ROLE */}

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <ShieldCheck
                  size={15}
                  className="text-blue-600"
                />

                <span className="text-xs font-semibold text-blue-700">
                  {loading
                    ? 'Loading role...'
                    : roleLabel}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <div className="p-6 sm:p-8">

          <div className="mb-5">

            <h3 className="text-lg font-bold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Your account details associated with this workspace.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* ==================================================
                FULL NAME
            ================================================== */}

            <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-105">

                  <User
                    size={20}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1.5 truncate text-sm font-semibold text-slate-800 sm:text-base">

                    {loading
                      ? 'Loading...'
                      : user?.full_name ||
                        '-'}

                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform duration-200 group-hover:scale-105">

                  <Mail
                    size={20}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-1.5 truncate text-sm font-semibold text-slate-800 sm:text-base">

                    {loading
                      ? 'Loading...'
                      : user?.email || '-'}

                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                ACCOUNT ROLE
            ================================================== */}

            <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-105">

                  <ShieldCheck
                    size={20}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Account Role
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-slate-800 sm:text-base">

                    {loading
                      ? 'Loading...'
                      : roleLabel}

                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                ACCOUNT STATUS
            ================================================== */}

            <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-105">

                  <CheckCircle2
                    size={20}
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Account Status
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-emerald-600 sm:text-base">
                    Active
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              REFRESH
          ================================================== */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-400">
              Profile information is retrieved from your account.
            </p>

            <button
              type="button"
              onClick={
                loadProfile
              }
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
            >

              <RefreshCw
                size={16}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />

              {loading
                ? 'Refreshing...'
                : 'Refresh Profile'}

            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Profile