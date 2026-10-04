import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FileText,
  MessageSquare,
  Sparkles,
  Upload,
  Database,
} from 'lucide-react'

import { getDocuments } from '../services/documentService'
import { getConversations } from '../services/chatService'
import api from '../services/api'


function Dashboard() {

  const [documentCount, setDocumentCount] =
    useState(0)

  const [conversationCount, setConversationCount] =
    useState(0)

  const [aiRequestCount, setAiRequestCount] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true)
        setError('')

        const [
          documents,
          conversations,
          aiRequests,
        ] = await Promise.all([

          getDocuments(),

          getConversations(),

          api.get(
            '/analytics/my-usage'
          ),

        ])


        // ------------------------------------------
        // DOCUMENT COUNT
        // ------------------------------------------

        setDocumentCount(

          Array.isArray(documents)

            ? documents.length

            : documents?.items?.length || 0

        )


        // ------------------------------------------
        // CONVERSATION COUNT
        // ------------------------------------------

        setConversationCount(

          Array.isArray(conversations)

            ? conversations.length

            : conversations?.items?.length || 0

        )


        // ------------------------------------------
        // PERSONAL AI REQUEST COUNT
        // ------------------------------------------

        setAiRequestCount(

          aiRequests.data?.total_ai_requests || 0

        )

      } catch (error) {

        console.error(
          'Dashboard loading error:',
          error
        )

        setError(
          'Unable to load dashboard statistics.'
        )

      } finally {

        setLoading(false)

      }

    }


    loadDashboardData()

  }, [])


  const statistics = [
    {
      label: 'Documents',
      value: documentCount,
      description: 'Knowledge base files',
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Conversations',
      value: conversationCount,
      description: 'AI conversations',
      icon: MessageSquare,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'My AI Requests',
      value: aiRequestCount,
      description: 'AI operations performed',
      icon: Sparkles,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ]


  return (

    <div className="space-y-8">


      {/* ==================================================
          WELCOME SECTION
      ================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* DECORATIVE BACKGROUND */}

        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />


        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">

              <Sparkles size={14} />

              AI-powered knowledge workspace

            </div>


            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">

              Welcome to Enterprise Knowledge Assistant

            </h1>


            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">

              Upload documents, build your knowledge base,
              and use AI to find answers and insights
              from your enterprise information.

            </p>

          </div>


          {/* PRIMARY ACTION */}

          <Link
            to="/documents"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >

            <Upload
              size={17}
            />

            Upload Document

            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />

          </Link>

        </div>

      </section>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span className="mt-0.5 font-semibold">
            !
          </span>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section>

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Workspace Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick view of your activity.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {statistics.map((stat) => {

            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >

                    <Icon
                      size={20}
                      className={stat.iconColor}
                    />

                  </div>


                  <Database
                    size={17}
                    className="text-slate-200 transition-colors group-hover:text-slate-300"
                  />

                </div>


                <div className="mt-5">

                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>


                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">

                    {loading
                      ? '...'
                      : stat.value}

                  </p>


                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>

                </div>

              </div>
            )

          })}

        </div>

      </section>


      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jump directly into the tools you use most.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


          {/* UPLOAD DOCUMENT */}

          <Link
            to="/documents"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">

                <Upload size={20} />

              </div>


              <ArrowUpRight
                size={18}
                className="text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600"
              />

            </div>


            <h3 className="mt-5 font-semibold text-slate-900">
              Upload Document
            </h3>


            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add PDF, DOCX or TXT files to your
              enterprise knowledge base.
            </p>


            <div className="mt-5 text-xs font-semibold text-blue-600">
              Manage documents →
            </div>

          </Link>


          {/* ASK AI */}

          <Link
            to="/chat"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100">

                <MessageSquare size={20} />

              </div>


              <ArrowUpRight
                size={18}
                className="text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600"
              />

            </div>


            <h3 className="mt-5 font-semibold text-slate-900">
              Ask AI
            </h3>


            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ask questions and get answers from
              your uploaded enterprise documents.
            </p>


            <div className="mt-5 text-xs font-semibold text-violet-600">
              Start conversation →
            </div>

          </Link>


          {/* AI TOOLS */}

          <Link
            to="/ai-tools"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">

                <Sparkles size={20} />

              </div>


              <ArrowUpRight
                size={18}
                className="text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600"
              />

            </div>


            <h3 className="mt-5 font-semibold text-slate-900">
              AI Tools
            </h3>


            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generate summaries, FAQs, key points
              and interview questions.
            </p>


            <div className="mt-5 text-xs font-semibold text-emerald-600">
              Explore AI tools →
            </div>

          </Link>

        </div>

      </section>

    </div>

  )
}


export default Dashboard