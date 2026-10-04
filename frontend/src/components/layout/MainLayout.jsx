import { useState } from 'react'

import Sidebar from './Sidebar'
import Header from './Header'
import AgentWidget from '../agent/AgentWidget'

function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={sidebarCollapsed}
      />

      <main
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${
          sidebarCollapsed
            ? 'ml-[72px]'
            : 'ml-64'
        }`}
      >
        <Header
          sidebarCollapsed={
            sidebarCollapsed
          }
          onToggleSidebar={
            toggleSidebar
          }
        />

        <section className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </section>
      </main>

      {/* Global AI Agent */}
      <AgentWidget />
    </div>
  )
}

export default MainLayout