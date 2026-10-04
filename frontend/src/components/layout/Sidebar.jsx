import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

function Sidebar({
  collapsed = false,
}) {
  const { user } = useAuth()

  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Documents',
      path: '/documents',
      icon: FileText,
    },
    {
      name: 'AI Chat',
      path: '/chat',
      icon: MessageSquare,
    },
    {
      name: 'AI Tools',
      path: '/ai-tools',
      icon: Sparkles,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ]

  const isAdmin =
    user?.role === 'admin'

  const displayName =
    user?.full_name ||
    user?.email ||
    'User'

  const initial =
    displayName
      .charAt(0)
      .toUpperCase()

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-slate-950 text-white transition-[width] duration-300 ease-in-out ${
        collapsed
          ? 'w-[72px]'
          : 'w-64'
      }`}
    >

      {/* ==================================================
          BRAND
      ================================================== */}

      <div
        className={`border-b border-slate-800/80 transition-all duration-300 ${
          collapsed
            ? 'px-3 py-5'
            : 'px-5 py-5'
        }`}
      >

        <div
          className={`flex items-center ${
            collapsed
              ? 'justify-center'
              : 'gap-3'
          }`}
        >

          {/* LOGO */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/20">

            <BrainCircuit
              size={22}
              strokeWidth={2}
              className="text-white"
            />

          </div>


          {/* BRAND NAME */}

          {!collapsed && (

            <div className="min-w-0">

              <h1 className="truncate text-sm font-bold tracking-wide text-white">
                Enterprise
              </h1>

              <p className="truncate text-xs text-slate-400">
                Knowledge Assistant
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <div className="flex-1 overflow-y-auto py-6">

        {/* WORKSPACE LABEL */}

        {!collapsed && (

          <p className="mb-3 px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

        )}


        <nav
          className={`space-y-1.5 ${
            collapsed
              ? 'px-2'
              : 'px-3'
          }`}
        >

          {links.map((link) => {

            const Icon = link.icon

            return (

              <NavLink
                key={link.path}
                to={link.path}
                title={
                  collapsed
                    ? link.name
                    : undefined
                }
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    collapsed
                      ? 'justify-center px-0 py-3'
                      : 'gap-3 px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`
                }
              >

                {({ isActive }) => (
                  <>

                    {/* ACTIVE INDICATOR */}

                    {isActive && (
                      <span className="absolute left-0 h-6 w-0.5 rounded-r-full bg-white" />
                    )}


                    {/* ICON */}

                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.9
                      }
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-slate-500 transition-colors group-hover:text-slate-300'
                      }
                    />


                    {/* LABEL */}

                    {!collapsed && (

                      <span className="flex-1">
                        {link.name}
                      </span>

                    )}


                    {/* ACTIVE ARROW */}

                    {!collapsed &&
                      isActive && (

                        <ChevronRight
                          size={15}
                          className="text-blue-100"
                        />

                      )}

                  </>
                )}

              </NavLink>

            )
          })}

        </nav>


        {/* ==================================================
            ADMINISTRATION
        ================================================== */}

        {isAdmin && (

          <div
            className={`mt-8 ${
              collapsed
                ? 'px-2'
                : ''
            }`}
          >

            {!collapsed && (

              <p className="mb-3 px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Administration
              </p>

            )}


            <NavLink
              to="/admin"
              title={
                collapsed
                  ? 'Admin Dashboard'
                  : undefined
              }
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  collapsed
                    ? 'justify-center px-0 py-3'
                    : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >

              {({ isActive }) => (
                <>

                  {isActive && (
                    <span className="absolute left-0 h-6 w-0.5 rounded-r-full bg-white" />
                  )}

                  <ShieldCheck
                    size={18}
                    strokeWidth={
                      isActive
                        ? 2.2
                        : 1.9
                    }
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-slate-500 transition-colors group-hover:text-slate-300'
                    }
                  />

                  {!collapsed && (

                    <span className="flex-1">
                      Admin Dashboard
                    </span>

                  )}

                  {!collapsed &&
                    isActive && (

                      <ChevronRight
                        size={15}
                        className="text-blue-100"
                      />

                    )}

                </>
              )}

            </NavLink>

          </div>

        )}

      </div>


      {/* ==================================================
          USER PROFILE
      ================================================== */}

      <div
        className={`border-t border-slate-800/80 transition-all duration-300 ${
          collapsed
            ? 'p-3'
            : 'p-3'
        }`}
      >

        <div
          title={
            collapsed
              ? displayName
              : undefined
          }
          className={`group flex items-center rounded-xl p-2.5 transition-colors hover:bg-slate-900 ${
            collapsed
              ? 'justify-center'
              : 'gap-3'
          }`}
        >

          {/* AVATAR */}

          <div className="relative shrink-0">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">

              {initial}

            </div>

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />

          </div>


          {/* USER INFO */}

          {!collapsed && (

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium text-slate-200">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {isAdmin
                  ? 'Administrator'
                  : 'Knowledge Assistant'}
              </p>

            </div>

          )}


          {/* ARROW */}

          {!collapsed && (

            <ChevronRight
              size={15}
              className="shrink-0 text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-400"
            />

          )}

        </div>

      </div>

    </aside>
  )
}

export default Sidebar