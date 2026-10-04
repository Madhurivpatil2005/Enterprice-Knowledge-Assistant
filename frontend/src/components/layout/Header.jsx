import { useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

function Header({
  sidebarCollapsed = false,
  onToggleSidebar,
}) {
  const location =
    useLocation()

  const navigate =
    useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const pageNames = {
    '/dashboard':
      'Dashboard',

    '/documents':
      'Documents',

    '/chat':
      'AI Chat',

    '/ai-tools':
      'AI Tools',

    '/profile':
      'Profile',

    '/admin':
      'Admin Dashboard',
  }

  const pageTitle =
    pageNames[
      location.pathname
    ] ||
    'Enterprise Knowledge Assistant'

  const displayName =
    user?.full_name ||
    user?.email ||
    'User'

  const initial =
    displayName
      .charAt(0)
      .toUpperCase()

  const role =
    user?.role === 'admin'
      ? 'Admin'
      : 'User'

  const handleLogout =
    () => {
      logout()

      navigate(
        '/login',
        {
          replace: true,
        }
      )
    }

  return (

    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

      {/* ==================================================
          LEFT SIDE
      ================================================== */}

      <div className="flex min-w-0 items-center gap-3">

        {/* SIDEBAR TOGGLE */}

        <button
          type="button"
          onClick={onToggleSidebar}
          title={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          aria-label={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
        >

          {sidebarCollapsed ? (

            <PanelLeftOpen
              size={19}
              className="transition-transform duration-200 group-hover:scale-105"
            />

          ) : (

            <PanelLeftClose
              size={19}
              className="transition-transform duration-200 group-hover:scale-105"
            />

          )}

        </button>


        {/* MOBILE-STYLE MENU INDICATOR */}

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />


        <div className="min-w-0">

          {/* BREADCRUMB */}

          <div className="mb-0.5 hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">

            <span>
              Workspace
            </span>

            <ChevronRight
              size={13}
              className="text-slate-300"
            />

            <span className="text-slate-500">
              {pageTitle}
            </span>

          </div>


          {/* PAGE TITLE */}

          <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {pageTitle}
          </h2>

        </div>

      </div>


      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <div className="flex items-center gap-2 sm:gap-3">


        {/* PROFILE */}

        <button
          type="button"
          onClick={() =>
            navigate('/profile')
          }
          className="group flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-all duration-200 hover:bg-slate-50 sm:gap-3 sm:px-2.5"
        >

          {/* AVATAR */}

          <div className="relative">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-sm ring-2 ring-white sm:h-10 sm:w-10">

              {initial}

            </div>

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />

          </div>


          {/* USER INFORMATION */}

          <div className="hidden max-w-40 sm:block">

            <div className="flex items-center gap-2">

              <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                {displayName}
              </p>

              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                {role}
              </span>

            </div>

            <p className="truncate text-xs text-slate-400">
              {user?.email ||
                'Knowledge Assistant'}
            </p>

          </div>

        </button>


        {/* DIVIDER */}

        <div className="hidden h-7 w-px bg-slate-200 sm:block" />


        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="group flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
        >

          <LogOut
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />

        </button>

      </div>

    </header>
  )
}

export default Header