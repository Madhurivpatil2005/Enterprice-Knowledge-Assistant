import { useState } from 'react'
import { Send } from 'lucide-react'

function ChatInput({
  onSend,
  loading,
}) {
  const [question, setQuestion] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedQuestion =
      question.trim()

    if (!trimmedQuestion || loading) {
      return
    }

    await onSend(trimmedQuestion)

    setQuestion('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white p-4"
    >

      <div className="flex items-end gap-3">

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey
            ) {
              event.preventDefault()
              handleSubmit(event)
            }
          }}
          placeholder="Ask a question about your documents..."
          rows={2}
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={
            loading ||
            !question.trim()
          }
          className="flex h-[52px] items-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />

          {loading
            ? 'Sending...'
            : 'Send'}
        </button>

      </div>

      <p className="mt-2 text-xs text-slate-400">
        Press Enter to send. Use Shift + Enter for a new line.
      </p>

    </form>
  )
}

export default ChatInput