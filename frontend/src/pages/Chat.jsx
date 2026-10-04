import { useEffect, useState } from 'react'
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import {
  askQuestion,
  getConversations,
  createConversation,
  getConversationMessages,
  renameConversation,
  deleteConversation,
} from '../services/chatService'

import ConversationList from '../components/chat/ConversationList'
import ChatMessage from '../components/chat/ChatMessage'
import ChatInput from '../components/chat/ChatInput'
import SourceList from '../components/chat/SourceList'

function Chat() {
  const [conversations, setConversations] =
    useState([])

  const [selectedConversationId, setSelectedConversationId] =
    useState(null)

  const [messages, setMessages] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [messagesLoading, setMessagesLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const handleAgentConversationCreated = (
      event
    ) => {
      const newConversation =
        event.detail

      if (!newConversation) {
        return
      }

      const newConversationId =
        newConversation.conversation_id ||
        newConversation.id

      if (!newConversationId) {
        return
      }

      setConversations((previous) => {
        const alreadyExists =
          previous.some((conversation) => {
            const existingId =
              conversation.conversation_id ||
              conversation.id

            return (
              String(existingId) ===
              String(newConversationId)
            )
          })

        if (alreadyExists) {
          return previous
        }

        return [
          newConversation,
          ...previous,
        ]
      })

      setSelectedConversationId(
        newConversationId
      )

      setMessages([])
    }

    window.addEventListener(
      'agent:conversation-created',
      handleAgentConversationCreated
    )

    return () => {
      window.removeEventListener(
        'agent:conversation-created',
        handleAgentConversationCreated
      )
    }
  }, [])


  // ==================================================
  // LOAD CONVERSATIONS
  // ==================================================

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setError('')

      const data =
        await getConversations()

      setConversations(
        Array.isArray(data)
          ? data
          : data?.items || []
      )
    } catch (error) {
      console.error(
        'Conversation loading error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to load conversations.'
      )
    }
  }

  // ==================================================
  // NEW CONVERSATION
  // ==================================================

  const handleNewConversation = async () => {
    try {
      setError('')

      const conversation =
        await createConversation()

      const conversationId =
        conversation.conversation_id ||
        conversation.id

      setConversations((previous) => [
        conversation,
        ...previous,
      ])

      setSelectedConversationId(
        conversationId
      )

      setMessages([])
    } catch (error) {
      console.error(
        'Create conversation error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to create conversation.'
      )
    }
  }

  // ==================================================
  // SELECT CONVERSATION
  // ==================================================

  const handleSelectConversation = async (
    conversationId
  ) => {
    try {
      setSelectedConversationId(
        conversationId
      )

      setMessagesLoading(true)
      setError('')

      const data =
        await getConversationMessages(
          conversationId
        )

      setMessages(
        Array.isArray(data)
          ? data
          : data?.messages || []
      )
    } catch (error) {
      console.error(
        'Message loading error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to load conversation messages.'
      )
    } finally {
      setMessagesLoading(false)
    }
  }

  // ==================================================
  // RENAME CONVERSATION
  // ==================================================

  const handleRenameConversation = async (
    conversationId,
    title
  ) => {
    try {
      setError('')

      const updatedConversation =
        await renameConversation(
          conversationId,
          title
        )

      setConversations((previous) =>
        previous.map((conversation) => {
          const id =
            conversation.conversation_id ||
            conversation.id

          if (
            String(id) ===
            String(conversationId)
          ) {
            return {
              ...conversation,
              ...updatedConversation,
              title:
                updatedConversation?.title ||
                title,
            }
          }

          return conversation
        })
      )
    } catch (error) {
      console.error(
        'Conversation rename error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to rename conversation.'
      )

      throw error
    }
  }

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const handleSend = async (
    question
  ) => {
    try {
      setError('')
      setLoading(true)

      let conversationId =
        selectedConversationId

      /*
       * Create a conversation automatically
       * if the user starts chatting without
       * selecting one.
       */

      if (!conversationId) {
        const conversation =
          await createConversation()

        conversationId =
          conversation.conversation_id ||
          conversation.id

        setSelectedConversationId(
          conversationId
        )

        setConversations((previous) => [
          conversation,
          ...previous,
        ])
      }

      /*
       * Show user's message immediately.
       */

      setMessages((previous) => [
        ...previous,
        {
          role: 'user',
          content: question,
        },
      ])

      /*
       * Ask the RAG backend.
       */

      const response =
        await askQuestion(
          question,
          conversationId
        )

      /*
       * Show AI response.
       */

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content:
            response.answer || '',
          sources:
            response.sources || [],
        },
      ])

      /*
       * Refresh conversation list.
       */

      await loadConversations()
    } catch (error) {
      console.error(
        'Chat error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to get an answer.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==================================================
  // DELETE CONVERSATION
  // ==================================================

  const handleDeleteConversation = async (
    conversationId
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this conversation?'
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteConversation(
        conversationId
      )

      setConversations((previous) =>
        previous.filter(
          (conversation) => {
            const id =
              conversation.conversation_id ||
              conversation.id

            return (
              String(id) !==
              String(conversationId)
            )
          }
        )
      )

      if (
        String(
          selectedConversationId
        ) ===
        String(conversationId)
      ) {
        setSelectedConversationId(null)
        setMessages([])
      }
    } catch (error) {
      console.error(
        'Delete conversation error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to delete conversation.'
      )
    }
  }

  const hasMessages =
    messages.length > 0

  const showWelcome =
    !selectedConversationId &&
    !hasMessages &&
    !messagesLoading

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] min-h-0 overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm lg:-m-8">

      {/* ==================================================
          CONVERSATION SIDEBAR
      ================================================== */}

      <aside className="hidden h-full w-72 shrink-0 border-r border-slate-200 bg-white md:block">

        <ConversationList
          conversations={conversations}
          selectedConversationId={
            selectedConversationId
          }
          onSelect={
            handleSelectConversation
          }
          onNew={
            handleNewConversation
          }
          onRename={
            handleRenameConversation
          }
          onDelete={
            handleDeleteConversation
          }
        />

      </aside>


      {/* ==================================================
          CHAT WORKSPACE
      ================================================== */}

      <div className="flex min-w-0 flex-1 flex-col bg-slate-50">

        {/* ==================================================
            CHAT HEADER
        ================================================== */}

        <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                <Sparkles
                  size={20}
                />

              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                    AI Knowledge Assistant
                  </h1>

                  <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 sm:inline-flex">
                    AI Ready
                  </span>

                </div>

                <p className="truncate text-xs text-slate-500">
                  Ask questions about your uploaded documents.
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-medium text-slate-500">
                Knowledge base connected
              </span>

            </div>

          </div>

        </header>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="shrink-0 border-b border-red-200 bg-red-50 px-5 py-3 sm:px-6">

            <div className="flex items-center gap-2 text-sm text-red-700">

              <AlertCircle
                size={16}
                className="shrink-0"
              />

              <span>
                {error}
              </span>

            </div>

          </div>

        )}


        {/* ==================================================
            MESSAGES AREA
        ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">

          {showWelcome && (

            <div className="flex min-h-full items-center justify-center px-5 py-10 sm:px-8">

              <div className="w-full max-w-2xl text-center">

                {/* ICON */}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">

                  <MessageSquare
                    size={30}
                  />

                </div>


                {/* TITLE */}

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                  Ask your documents
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                  Ask questions about your uploaded
                  documents and get answers using your
                  RAG-powered knowledge assistant.
                </p>


                {/* CAPABILITIES */}

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">

                    <FileText
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-800">
                      Document-aware
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Answers based on your knowledge base.
                    </p>

                  </div>


                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">

                    <Sparkles
                      size={18}
                      className="text-violet-600"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-800">
                      AI-powered
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Get contextual answers to your questions.
                    </p>

                  </div>


                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">

                    <ShieldCheck
                      size={18}
                      className="text-emerald-600"
                    />

                    <p className="mt-3 text-xs font-semibold text-slate-800">
                      Source-aware
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      View supporting document sources.
                    </p>

                  </div>

                </div>


                {/* NEW CHAT */}

                <button
                  type="button"
                  onClick={
                    handleNewConversation
                  }
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                >

                  <Plus
                    size={17}
                  />

                  Start a new conversation

                  <ArrowUpRight
                    size={15}
                  />

                </button>

              </div>

            </div>

          )}


          {messagesLoading && (

            <div className="flex h-full items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                </div>

                <p className="text-sm font-medium text-slate-600">
                  Loading conversation...
                </p>

                <p className="text-xs text-slate-400">
                  Retrieving your messages
                </p>

              </div>

            </div>

          )}


          {!messagesLoading && hasMessages && (

            <div className="mx-auto w-full max-w-4xl space-y-6 px-5 py-6 sm:px-8">

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className="space-y-2"
                  >

                    <ChatMessage
                      message={message}
                    />

                    {(message.role ===
                      'assistant' ||
                      message.sender ===
                        'assistant') && (

                      <SourceList
                        sources={
                          message.sources ||
                          []
                        }
                      />

                    )}

                  </div>

                )
              )}


              {/* THINKING */}

              {loading && (

                <div className="flex justify-start">

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <div className="flex items-center gap-1">

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />

                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      AI is thinking...
                    </span>

                  </div>

                </div>

              )}

            </div>

          )}

        </div>


        {/* ==================================================
            CHAT INPUT
        ================================================== */}

        <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">

          <div className="mx-auto w-full max-w-4xl">

            <ChatInput
              onSend={handleSend}
              loading={loading}
            />

          </div>

        </div>

      </div>

    </div>
  )
}

export default Chat