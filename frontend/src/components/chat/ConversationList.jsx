import {
  MessageSquare,
  Plus,
  Trash2,
  Clock3,
  MoreVertical,
  Pencil,
  Check,
  X,
} from 'lucide-react'

import { useState } from 'react'

function ConversationList({
  conversations,
  selectedConversationId,
  onSelect,
  onNew,
  onDelete,
  onRename,
}) {
  const [openMenuId, setOpenMenuId] =
    useState(null)

  const [renameId, setRenameId] =
    useState(null)

  const [renameValue, setRenameValue] =
    useState('')

  const [renaming, setRenaming] =
    useState(false)

  const startRename = (
    id,
    currentTitle
  ) => {
    setOpenMenuId(null)
    setRenameId(id)
    setRenameValue(
      currentTitle || 'New Conversation'
    )
  }

  const cancelRename = () => {
    if (renaming) {
      return
    }

    setRenameId(null)
    setRenameValue('')
  }

  const handleRename = async () => {
    const title = renameValue.trim()

    if (!title) {
      return
    }

    if (!onRename) {
      return
    }

    try {
      setRenaming(true)

      await onRename(
        renameId,
        title
      )

      setRenameId(null)
      setRenameValue('')
    } catch (error) {
      console.error(
        'Conversation rename error:',
        error
      )
    } finally {
      setRenaming(false)
    }
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="shrink-0 border-b border-slate-100 p-4">

        <button
          type="button"
          onClick={onNew}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
        >
          <Plus
            size={18}
            className="transition-transform duration-200 group-hover:rotate-90"
          />

          New Conversation
        </button>

        {/* SECTION TITLE */}

        <div className="mt-5 flex items-center justify-between px-1">

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Conversations
            </h2>
          </div>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            {conversations.length}
          </span>

        </div>

      </div>


      {/* ==================================================
          CONVERSATION LIST
      ================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">

        {conversations.length === 0 ? (

          /* ==================================================
             EMPTY STATE
          ================================================== */

          <div className="flex h-full min-h-64 flex-col items-center justify-center px-4 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

              <MessageSquare
                size={22}
              />

            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No conversations yet
            </p>

            <p className="mt-1 max-w-[190px] text-xs leading-5 text-slate-400">
              Start a new conversation to ask questions about your documents.
            </p>

            <button
              type="button"
              onClick={onNew}
              className="mt-4 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Start your first chat →
            </button>

          </div>

        ) : (

          <div className="space-y-1">

            {conversations.map(
              (conversation) => {

                const id =
                  conversation.conversation_id ||
                  conversation.id

                const isSelected =
                  id === selectedConversationId

                const isRenaming =
                  renameId === id

                return (

                  <div
                    key={id}
                    className={`group relative flex items-center rounded-xl transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >

                    {/* ACTIVE INDICATOR */}

                    {isSelected && (
                      <span className="absolute left-0 h-7 w-0.5 rounded-r-full bg-blue-600" />
                    )}


                    {/* CONVERSATION */}

                    <div className="min-w-0 flex-1">

                      {isRenaming ? (

                        /* ==================================================
                           RENAME INPUT
                        ================================================== */

                        <div className="flex items-center gap-2 px-3 py-2.5">

                          <MessageSquare
                            size={15}
                            className="shrink-0 text-blue-500"
                          />

                          <input
                            type="text"
                            value={renameValue}
                            onChange={(event) =>
                              setRenameValue(
                                event.target.value
                              )
                            }
                            onKeyDown={(event) => {
                              if (
                                event.key ===
                                'Enter'
                              ) {
                                handleRename()
                              }

                              if (
                                event.key ===
                                'Escape'
                              ) {
                                cancelRename()
                              }
                            }}
                            autoFocus
                            disabled={renaming}
                            className="min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                          />

                          {/* Save */}

                          <button
                            type="button"
                            onClick={
                              handleRename
                            }
                            disabled={
                              renaming ||
                              !renameValue.trim()
                            }
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Save"
                            aria-label="Save rename"
                          >
                            <Check
                              size={15}
                            />
                          </button>

                          {/* Cancel */}

                          <button
                            type="button"
                            onClick={
                              cancelRename
                            }
                            disabled={renaming}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Cancel"
                            aria-label="Cancel rename"
                          >
                            <X
                              size={15}
                            />
                          </button>

                        </div>

                      ) : (

                        <button
                          type="button"
                          onClick={() =>
                            onSelect(id)
                          }
                          className="min-w-0 w-full px-3 py-3 text-left"
                        >

                          <div className="flex items-start gap-2.5">

                            <MessageSquare
                              size={15}
                              className={`mt-0.5 shrink-0 ${
                                isSelected
                                  ? 'text-blue-600'
                                  : 'text-slate-400 group-hover:text-slate-500'
                              }`}
                            />

                            <div className="min-w-0 flex-1">

                              <p
                                className={`truncate pr-2 text-sm font-medium ${
                                  isSelected
                                    ? 'text-blue-700'
                                    : 'text-slate-700'
                                }`}
                              >
                                {conversation.title ||
                                  'New Conversation'}
                              </p>

                              {conversation.updated_at && (

                                <div className="mt-1 flex items-center gap-1">

                                  <Clock3
                                    size={11}
                                    className={
                                      isSelected
                                        ? 'text-blue-400'
                                        : 'text-slate-400'
                                    }
                                  />

                                  <p
                                    className={`text-[11px] ${
                                      isSelected
                                        ? 'text-blue-400'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {new Date(
                                      conversation.updated_at
                                    ).toLocaleDateString(
                                      undefined,
                                      {
                                        month:
                                          'short',
                                        day:
                                          'numeric',
                                        year:
                                          'numeric',
                                      }
                                    )}
                                  </p>

                                </div>

                              )}

                            </div>

                          </div>

                        </button>

                      )}

                    </div>


                    {/* ==================================================
                        MORE ACTIONS
                    ================================================== */}

                    {!isRenaming && (
                      <div className="relative mr-2 shrink-0">

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()

                            setOpenMenuId(
                              openMenuId ===
                                id
                                ? null
                                : id
                            )
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 focus:opacity-100"
                          title="More actions"
                          aria-label="More actions"
                        >
                          <MoreVertical
                            size={16}
                          />
                        </button>


                        {/* MENU */}

                        {openMenuId === id && (

                          <div className="absolute right-0 top-9 z-40 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">

                            {/* Rename */}

                            <button
                              type="button"
                              onClick={() =>
                                startRename(
                                  id,
                                  conversation.title
                                )
                              }
                              className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil
                                size={15}
                                className="text-slate-500"
                              />

                              Rename
                            </button>


                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                onDelete(id)
                              }}
                              className="flex w-full items-center gap-3 border-t border-slate-100 px-3.5 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2
                                size={15}
                              />

                              Delete
                            </button>

                          </div>

                        )}

                      </div>
                    )}

                  </div>

                )
              }
            )}

          </div>

        )}

      </div>


      {/* ==================================================
          FOOTER
      ================================================== */}

      {conversations.length > 0 && (

        <div className="shrink-0 border-t border-slate-100 px-4 py-3">

          <p className="text-center text-[10px] text-slate-400">
            Your conversations are private to your account.
          </p>

        </div>

      )}

    </aside>
  )
}

export default ConversationList