
import { useEffect, useRef, useState } from 'react'
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  FileText,
  Loader2,
  Mic,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

import AgentMessage from './AgentMessage'

import { sendAgentCommand } from '../../services/agentService'

import {
  getDocuments,
  updateDocument,
  deleteDocument,
} from '../../services/documentService'

import { createConversation } from '../../services/chatService'

import {
  generateSummary,
  generateKeywords,
  generateKeyPoints,
  generateFAQs,
  generateInterviewQuestions,
  generateSuggestedQuestions,
} from '../../services/aiService'

const AI_TOOLS = [
  'summarize_document',
  'generate_keywords',
  'generate_key_points',
  'generate_faqs',
  'generate_interview_questions',
  'suggest_questions',
]

function AgentPanel({
  onClose,
  currentPage,
  onNavigate,
}) {
  const [command, setCommand] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const recognitionRef = useRef(null)
  const voiceResponseRef = useRef(false)
  const voiceEnabledRef = useRef(false)

  const [
    pendingDelete,
    setPendingDelete,
  ] = useState(null)

  const [
    pendingAIAction,
    setPendingAIAction,
  ] = useState(null)

  const [
    pendingAIDocument,
    setPendingAIDocument,
  ] = useState(null)

  const [
    showResultChoice,
    setShowResultChoice,
  ] = useState(false)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return undefined
    }

    const recognition =
      new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-IN'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim()

      if (transcript) {
        setCommand(transcript)

        setTimeout(() => {
          handleSend(transcript)
        }, 0)
      }
    }

    recognition.onerror = (event) => {
      console.error(
        'Agent voice input error:',
        event.error
      )
      setIsListening(false)
      voiceResponseRef.current = false
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
      voiceResponseRef.current = false
      voiceEnabledRef.current = false
      window.speechSynthesis?.cancel()
    }
  }, [])

  const speakAgentResponse = (content) => {
    if (
      !voiceEnabledRef.current ||
      typeof content !== 'string' ||
      !content.trim()
    ) {
      return
    }

    if (!('speechSynthesis' in window)) {
      voiceResponseRef.current = false
      return
    }

    const text = content
      .replace(/[*#_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!text) {
      voiceResponseRef.current = false
      return
    }

    window.speechSynthesis.cancel()

    const utterance =
      new SpeechSynthesisUtterance(text)

    utterance.lang = 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      voiceResponseRef.current = false
    }

    utterance.onerror = () => {
      voiceResponseRef.current = false
    }

    window.speechSynthesis.speak(utterance)
  }

  const handleVoiceInput = () => {
    const recognition =
      recognitionRef.current

    if (!recognition) {
      return
    }

    if (voiceEnabled || isListening) {
      recognition.stop()
      window.speechSynthesis?.cancel()
      voiceResponseRef.current = false
      voiceEnabledRef.current = false
      setVoiceEnabled(false)
      setIsListening(false)
      return
    }

    if (loading) {
      return
    }

    try {
      voiceResponseRef.current = true
      voiceEnabledRef.current = true
      setVoiceEnabled(true)
      recognition.start()
    } catch (error) {
      console.error(
        'Unable to start Agent voice input:',
        error
      )
      voiceResponseRef.current = false
      voiceEnabledRef.current = false
      setVoiceEnabled(false)
      setIsListening(false)
    }
  }

  const addMessage = (
    type,
    content
  ) => {
    setMessages((previous) => [
      ...previous,
      {
        type,
        content,
      },
    ])

    if (type === 'assistant') {
      speakAgentResponse(content)
    }

    if (type === 'documents') {
      const documentNames = content
        .map((document) => getDocumentName(document))
        .filter(Boolean)

      if (documentNames.length) {
        speakAgentResponse(
          `You have ${documentNames.length} document${documentNames.length === 1 ? '' : 's'}: ${documentNames.join(', ')}.`
        )
      }
    }
  }

  const getDocumentId = (
    document
  ) => {
    return (
      document?.document_id ||
      document?.id ||
      document?._id
    )
  }

  const getDocumentName = (
    document
  ) => {
    return (
      document?.filename ||
      document?.file_name ||
      document?.name ||
      ''
    ).trim()
  }

  /*
   * Find a document by filename.
   * Matching is case-insensitive.
   */
  const findDocument = async (
    filename
  ) => {
    const data =
      await getDocuments()

    const documents =
      Array.isArray(data)
        ? data
        : data?.items ||
          data?.documents ||
          []

    if (!documents.length) {
      return null
    }

    const target =
      filename
        .trim()
        .toLowerCase()

    const exact =
      documents.find(
        (document) =>
          getDocumentName(
            document
          ).toLowerCase() ===
          target
      )

    if (exact) {
      return exact
    }

    const matches =
      documents.filter(
        (document) => {
          const name =
            getDocumentName(
              document
            ).toLowerCase()

          return (
            name.includes(target) ||
            target.includes(name)
          )
        }
      )

    return matches.length === 1
      ? matches[0]
      : null
  }

  /*
   * Resolve a document for an AI action.
   *
   * Explicit filename:
   *   exact/partial case-insensitive match
   *
   * No filename + one document:
   *   use that document
   *
   * No filename + multiple documents:
   *   ask the user
   */
  const resolveDocumentForAI =
    async (
      requestedFilename = ''
    ) => {
      const data =
        await getDocuments()

      const documents =
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.documents ||
            []

      if (!documents.length) {
        return {
          document: null,
          error:
            'You do not have any documents yet. Please upload a document first.',
        }
      }

      const target =
        requestedFilename
          .trim()
          .toLowerCase()

      if (target) {
        const exact =
          documents.find(
            (document) =>
              getDocumentName(
                document
              ).toLowerCase() ===
              target
          )

        if (exact) {
          return {
            document: exact,
            error: null,
          }
        }

        const matches =
          documents.filter(
            (document) => {
              const name =
                getDocumentName(
                  document
                ).toLowerCase()

              return (
                name.includes(target) ||
                target.includes(name)
              )
            }
          )

        if (matches.length === 1) {
          return {
            document: matches[0],
            error: null,
          }
        }

        if (matches.length > 1) {
          return {
            document: null,
            error:
              'I found more than one matching document. Please provide the full document filename.',
          }
        }

        return {
          document: null,
          error:
            `I couldn't find a document matching "${requestedFilename}". Please check the filename and try again.`,
        }
      }

      if (documents.length === 1) {
        return {
          document: documents[0],
          error: null,
        }
      }

      return {
        document: null,
        error:
          'Which document would you like me to use? Please provide the document filename.',
      }
    }

  const getRequestedAIFilename = (
    parameters = {}
  ) => {
    return (
      parameters.filename ||
      parameters.document_filename ||
      parameters.document_name ||
      parameters.file ||
      parameters.file_name ||
      ''
    )
  }

  const getAIToolTitle = (
    tool
  ) => {
    const titles = {
      summarize_document:
        'Summary',
      generate_keywords:
        'Keywords',
      generate_key_points:
        'Key Points',
      generate_faqs:
        'FAQs',
      generate_interview_questions:
        'Interview Questions',
      suggest_questions:
        'Suggested Questions',
    }

    return (
      titles[tool] ||
      'AI Result'
    )
  }

  const formatAIResult = (
    tool,
    result
  ) => {
    const filename =
      result?.filename ||
      'the selected document'

    if (
      tool ===
      'summarize_document'
    ) {
      return (
        `### Summary — ${filename}\n\n` +
        (result.summary || '')
      )
    }

    if (
      tool ===
      'generate_keywords'
    ) {
      return (
        `### Keywords — ${filename}\n\n` +
        (result.keywords || [])
          .join(', ')
      )
    }

    if (
      tool ===
      'generate_key_points'
    ) {
      return (
        `### Key Points — ${filename}\n\n` +
        (result.key_points || [])
          .map(
            (point) =>
              `• ${point}`
          )
          .join('\n')
      )
    }

    if (
      tool ===
      'generate_faqs'
    ) {
      return (
        `### FAQs — ${filename}\n\n` +
        (result.faqs || [])
          .map(
            (faq) =>
              `**Q:** ${faq.question}\n\n**A:** ${faq.answer}`
          )
          .join('\n\n')
      )
    }

    if (
      tool ===
      'generate_interview_questions'
    ) {
      return (
        `### Interview Questions — ${filename}\n\n` +
        (result.questions || [])
          .map(
            (item, index) =>
              `**${index + 1}. ${item.question}**\n\nExpected answer: ${item.expected_answer}`
          )
          .join('\n\n')
      )
    }

    if (
      tool ===
      'suggest_questions'
    ) {
      return (
        `### Suggested Questions — ${filename}\n\n` +
        (result.questions || [])
          .map(
            (question, index) =>
              `${index + 1}. ${question}`
          )
          .join('\n')
      )
    }

    return (
      'I could not generate the requested AI result.'
    )
  }

  const executeAITool = async (
    tool,
    document
  ) => {
    const documentId =
      getDocumentId(
        document
      )

    if (!documentId) {
      throw new Error(
        'The document ID could not be determined.'
      )
    }

    switch (tool) {
      case 'summarize_document':
        return generateSummary(
          documentId
        )

      case 'generate_keywords':
        return generateKeywords(
          documentId
        )

      case 'generate_key_points':
        return generateKeyPoints(
          documentId
        )

      case 'generate_faqs':
        return generateFAQs(
          documentId
        )

      case 'generate_interview_questions':
        return generateInterviewQuestions(
          documentId
        )

      case 'suggest_questions':
        return generateSuggestedQuestions(
          documentId
        )

      default:
        throw new Error(
          'Invalid AI tool selected.'
        )
    }
  }

  /*
   * Show the generated AI result
   * directly inside the Agent panel.
   */
  const handleShowAIResult =
    async () => {
      if (
        !pendingAIAction ||
        !pendingAIDocument
      ) {
        return
      }

      try {
        setLoading(true)
        setShowResultChoice(false)

        const result =
          await executeAITool(
            pendingAIAction.tool,
            pendingAIDocument
          )

        addMessage(
          'assistant',
          formatAIResult(
            pendingAIAction.tool,
            result
          )
        )

        setPendingAIAction(null)
        setPendingAIDocument(null)
      } catch (error) {
        console.error(
          'Agent AI generation error:',
          error
        )

        addMessage(
          'assistant',
          error.response?.data
            ?.detail ||
            error.message ||
            'I could not generate the requested AI result.'
        )
      } finally {
        setLoading(false)
      }
    }

  /*
   * Generate the result, hand it to
   * AI Tools, then navigate there.
   */
  const handleOpenAITools =
    async () => {
      if (
        !pendingAIAction ||
        !pendingAIDocument
      ) {
        return
      }

      try {
        setLoading(true)
        setShowResultChoice(false)

        const result =
          await executeAITool(
            pendingAIAction.tool,
            pendingAIDocument
          )

        const payload = {
          tool:
            pendingAIAction.tool,
          documentId:
            getDocumentId(
              pendingAIDocument
            ),
          filename:
            getDocumentName(
              pendingAIDocument
            ),
          result,
        }

        /*
         * Store before navigation because
         * AITools may mount after navigation.
         */
        sessionStorage.setItem(
          'agent:ai-result',
          JSON.stringify(
            payload
          )
        )
        window.dispatchEvent(
          new CustomEvent(
            'agent:ai-result-ready',
            {
              detail: payload,
            }
          )
        )

        addMessage(
          'assistant',
          `Done. I generated ${getAIToolTitle(
            pendingAIAction.tool
          )} for "${payload.filename}". Opening AI Tools.`
        )

        setPendingAIAction(null)
        setPendingAIDocument(null)

        onNavigate(
          'ai-tools'
        )
      } catch (error) {
        console.error(
          'Agent AI Tools generation error:',
          error
        )

        addMessage(
          'assistant',
          error.response?.data
            ?.detail ||
            error.message ||
            'I could not generate the requested AI result.'
        )
      } finally {
        setLoading(false)
      }
    }

  /*
   * Execute Agent actions.
   */
  const executeAction = async (
    action
  ) => {
    if (!action) {
      return
    }

    const {
      type,
      tool,
      parameters = {},
    } = action

    /*
     * -------------------------
     * Navigation
     * -------------------------
     */
    if (
      type === 'navigation'
    ) {
      const page =
        parameters.page

      onNavigate(page)

      addMessage(
        'assistant',
        `Opening ${page.replace(
          '-',
          ' '
        )}.`
      )

      return
    }

    /*
     * -------------------------
     * List documents
     * -------------------------
     */
    if (
      type === 'tool' &&
      tool ===
        'list_documents'
    ) {
      const data =
        await getDocuments()

      const documents =
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.documents ||
            []

      if (
        !documents.length
      ) {
        addMessage(
          'assistant',
          'You currently have no documents.'
        )

        return
      }

      addMessage(
        'documents',
        documents
      )

      return
    }

    /*
     * -------------------------
     * Create conversation
     * -------------------------
     */
    if (
      type === 'tool' &&
      tool ===
        'create_conversation'
    ) {
      const conversation =
        await createConversation()

      window.dispatchEvent(
        new CustomEvent(
          'agent:conversation-created',
          {
            detail:
              conversation,
          }
        )
      )

      addMessage(
        'assistant',
        'Your new conversation has been created.'
      )

      onNavigate('chat')

      return
    }

    /*
     * -------------------------
     * Rename document
     * -------------------------
     */
    if (
      type === 'tool' &&
      tool ===
        'rename_document'
    ) {
      const {
        old_filename,
        new_filename,
      } = parameters

      const document =
        await findDocument(
          old_filename
        )

      if (!document) {
        addMessage(
          'assistant',
          `I couldn't find a document named "${old_filename}".`
        )

        return
      }

      const documentId =
        getDocumentId(
          document
        )

      if (!documentId) {
        throw new Error(
          'The document ID could not be determined.'
        )
      }

      await updateDocument(
        documentId,
        new_filename
      )

      const updatedDocument = {
        ...document,
        filename:
          new_filename,
      }

      window.dispatchEvent(
        new CustomEvent(
          'agent:document-changed',
          {
            detail: {
              type: 'renamed',
              document:
                updatedDocument,
            },
          }
        )
      )

      addMessage(
        'assistant',
        `Done. I renamed "${old_filename}" to "${new_filename}".`
      )

      return
    }

    /*
     * -------------------------
     * AI document tools
     * -------------------------
     */
    if (
      type === 'tool' &&
      AI_TOOLS.includes(tool)
    ) {
      const {
        document,
        error,
      } =
        await resolveDocumentForAI(
          getRequestedAIFilename(
            parameters
          )
        )

      if (!document) {
        setPendingAIAction({
          tool,
          parameters,
        })

        setPendingAIDocument(null)
        setShowResultChoice(false)

        addMessage(
          'assistant',
          error
        )

        return
      }

      /*
       * Document found.
       * Ask the user where to display
       * the result before generating it.
       */
      setPendingAIAction({
        tool,
        parameters,
      })

      setPendingAIDocument(
        document
      )

      setShowResultChoice(
        true
      )

      addMessage(
        'assistant',
        `I found "${getDocumentName(
          document
        )}". Where would you like to view the ${getAIToolTitle(
          tool
        ).toLowerCase()}?`
      )

      return
    }

    /*
     * -------------------------
     * Delete document
     * -------------------------
     */
    if (
      type === 'tool' &&
      tool ===
        'delete_document'
    ) {
      const {
        filename,
      } = parameters

      const document =
        await findDocument(
          filename
        )

      if (!document) {
        addMessage(
          'assistant',
          `I couldn't find a document named "${filename}".`
        )

        return
      }

      setPendingDelete({
        document,
        filename:
          getDocumentName(
            document
          ) ||
          filename,
        documentId:
          getDocumentId(
            document
          ),
      })

      return
    }
  }

  /*
   * Confirm document deletion.
   */
  const handleConfirmDelete =
    async () => {
      if (
        !pendingDelete?.documentId ||
        loading
      ) {
        return
      }

      try {
        setLoading(true)

        await deleteDocument(
          pendingDelete.documentId
        )

        window.dispatchEvent(
          new CustomEvent(
            'agent:document-changed',
            {
              detail: {
                type: 'deleted',
                document:
                  pendingDelete.document,
              },
            }
          )
        )

        addMessage(
          'assistant',
          `Done. "${pendingDelete.filename}" has been deleted.`
        )

        setPendingDelete(
          null
        )
      } catch (error) {
        console.error(
          'Agent delete document error:',
          error
        )

        addMessage(
          'assistant',
          error.response?.data
            ?.detail ||
            'I could not delete that document.'
        )
      } finally {
        setLoading(false)
      }
    }

  /*
   * Cancel deletion.
   */
  const handleCancelDelete =
    () => {
      setPendingDelete(
        null
      )

      addMessage(
        'assistant',
        'Okay. I did not delete the document.'
      )
    }

  /*
   * If the Agent previously asked
   * which document to use, the next
   * user message is treated as the
   * document filename.
   */
  const handlePendingAIReply =
    async (
      reply
    ) => {
      if (!pendingAIAction) {
        return false
      }

      const {
        document,
        error,
      } =
        await resolveDocumentForAI(
          reply
        )

      if (!document) {
        addMessage(
          'assistant',
          error
        )

        return true
      }

      setPendingAIDocument(
        document
      )

      setShowResultChoice(
        true
      )

      addMessage(
        'assistant',
        `I found "${getDocumentName(
          document
        )}". Where would you like to view the ${getAIToolTitle(
          pendingAIAction.tool
        ).toLowerCase()}?`
      )

      return true
    }

  /*
   * Send command.
   */
  const handleSend = async (
    commandOverride = ''
  ) => {
    const trimmedCommand =
      commandOverride.trim() ||
      command.trim()

    if (
      !trimmedCommand ||
      loading
    ) {
      return
    }

    addMessage(
      'user',
      trimmedCommand
    )

    setCommand('')
    setLoading(true)

    try {
      /*
       * If an AI command is waiting
       * for a document name, resolve it
       * before sending a new command to
       * the backend.
       */
      if (
        pendingAIAction &&
        !pendingAIDocument
      ) {
        await handlePendingAIReply(
          trimmedCommand
        )

        return
      }

      const response =
        await sendAgentCommand(
          trimmedCommand,
          currentPage
        )

      if (
        response?.action
      ) {
        await executeAction(
          response.action
        )
      } else {
        addMessage(
          'assistant',
          response?.message ||
            'I could not determine an action for that request.'
        )
      }
    } catch (error) {
      console.error(
        'Agent execution error:',
        error
      )

      addMessage(
        'assistant',
        error.response?.data
          ?.detail ||
          error.message ||
          'I could not complete that request right now.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()

      handleSend()
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-5 py-4 text-white">

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-violet-200" />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-sm font-semibold">
                  Enterprise Agent
                </h2>

                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  Online
                </span>

              </div>

              <p className="mt-0.5 text-xs text-slate-300">
                Your AI workspace assistant
              </p>

            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close agent"
          >
            <X className="h-4 w-4" />
          </button>

        </div>
      </div>

      {/* Conversation */}
      <div className="max-h-[420px] min-h-[320px] space-y-4 overflow-y-auto bg-slate-50/70 p-4">

        <AgentMessage>
          <p>
            Hi! 👋 I'm your Enterprise Agent.
          </p>

          <p className="mt-2">
            Tell me what you want to do and
            I'll take care of it.
          </p>
        </AgentMessage>

        {messages.map(
          (message, index) => {

            if (
              message.type ===
              'documents'
            ) {
              return (
                <div
                  key={`documents-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  <div className="mb-3 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Your Documents
                      </p>

                      <p className="text-xs text-slate-500">
                        {
                          message.content
                            .length
                        }{' '}
                        document
                        {message.content.length !==
                        1
                          ? 's'
                          : ''}
                      </p>
                    </div>

                  </div>

                  <div className="space-y-2">

                    {message.content
                      .slice(0, 6)
                      .map(
                        (
                          document,
                          documentIndex
                        ) => (
                          <div
                            key={
                              document.id ||
                              document.document_id ||
                              document._id ||
                              documentIndex
                            }
                            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                          >

                            <FileText className="h-4 w-4 shrink-0 text-slate-500" />

                            <span className="min-w-0 truncate text-xs font-medium text-slate-700">
                              {getDocumentName(
                                document
                              ) ||
                                'Untitled document'}
                            </span>

                          </div>
                        )
                      )}

                  </div>

                  {message.content.length >
                    6 && (
                    <p className="mt-3 text-center text-[11px] text-slate-400">
                      Showing the first 6
                      documents
                    </p>
                  )}

                </div>
              )
            }

            return (
              <AgentMessage
                key={`${message.type}-${index}`}
                type={
                  message.type ===
                  'user'
                    ? 'user'
                    : 'assistant'
                }
              >
                {message.content}
              </AgentMessage>
            )
          }
        )}

        {/* AI result destination */}
        {showResultChoice &&
          pendingAIAction &&
          pendingAIDocument && (
            <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">

              <p className="text-sm font-semibold text-slate-900">
                Where would you like to view the result?
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {getAIToolTitle(
                  pendingAIAction.tool
                )}{' '}
                for{' '}
                <span className="font-medium text-slate-700">
                  {getDocumentName(
                    pendingAIDocument
                  )}
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={
                    handleShowAIResult
                  }
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
                >
                  Show Here
                </button>

                <button
                  type="button"
                  onClick={
                    handleOpenAITools
                  }
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  Open AI Tools
                </button>

              </div>
            </div>
          )}

        {/* Delete confirmation */}
        {pendingDelete && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Delete document?
                </p>

                <p className="mt-1 break-words text-xs leading-relaxed text-slate-500">
                  Are you sure you want to permanently
                  delete{' '}
                  <span className="font-semibold text-slate-700">
                    "{pendingDelete.filename}"
                  </span>
                  ?
                </p>
              </div>

            </div>

            <div className="mt-4 flex gap-2">

              <button
                type="button"
                onClick={
                  handleCancelDelete
                }
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}

                Delete
              </button>

            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">

            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">

              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />

              <span>
                Agent is working...
              </span>

            </div>

          </div>
        )}

        {!messages.length && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">

            <div className="mb-2 flex items-center gap-2">

              <Bot className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-semibold text-indigo-900">
                Try asking
              </span>

            </div>

            <div className="space-y-1.5 text-xs text-indigo-800">

              <p>
                • "Show my documents"
              </p>

              <p>
                • "Rename report.pdf to final_report.pdf"
              </p>

              <p>
                • "Delete report.pdf"
              </p>

              <p>
                • "Create a new conversation"
              </p>

              <p>
                • "Summarize Resume.pdf"
              </p>

              <p>
                • "Generate FAQs for Project.pdf"
              </p>

            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3">

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">

          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={loading}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
              isListening
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                : 'text-slate-500 hover:bg-white hover:text-indigo-600'
            } disabled:cursor-not-allowed disabled:opacity-40`}
            title={
              voiceEnabled
                ? 'Stop voice & speech'
                : 'Voice input'
            }
            aria-label={
              voiceEnabled
                ? 'Stop voice & speech'
                : 'Voice input'
            }
          >
            <Mic
              className={`h-4 w-4 ${
                voiceEnabled
                  ? 'animate-pulse'
                  : ''
              }`}
            />
          </button>

          <input
            type="text"
            value={command}
            onChange={(event) =>
              setCommand(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            disabled={loading}
            placeholder="Ask me anything..."
            className="min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={
              !command.trim() ||
              loading
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="Send"
            aria-label="Send"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>

        </div>

        <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
          <CheckCircle2 className="h-3 w-3" />
          Actions use your existing permissions
        </p>

      </div>
    </div>
  )
}

export default AgentPanel
