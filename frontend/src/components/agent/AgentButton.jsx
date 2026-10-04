import {
  Mic,
  Sparkles,
  X,
} from 'lucide-react'

function AgentButton({
  open,
  listening,
  onClick,
}) {
  return (
    <div className="fixed bottom-6 right-4 z-50 sm:right-6">
      {!open && (
        <div className="absolute bottom-full right-0 mb-3 hidden whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg sm:block">
          {listening
            ? 'Listening...'
            : 'Need any help?'}

          <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r border-slate-200 bg-white" />
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        aria-label={
          open
            ? 'Close Enterprise Agent'
            : listening
              ? 'Stop voice input'
              : 'Start voice command'
        }
        className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30 ${
          listening
            ? 'scale-110 animate-pulse'
            : ''
        }`}
      >
        <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition group-hover:opacity-100" />

        {open ? (
          <X className="relative h-5 w-5" />
        ) : listening ? (
          <Mic className="relative h-5 w-5" />
        ) : (
          <>
            <Sparkles className="relative h-5 w-5 transition group-hover:scale-110" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default AgentButton