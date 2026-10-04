function AgentMessage({
  type = 'assistant',
  children,
}) {
  const isUser = type === 'user'

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-slate-900 text-white'
            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'
        }`}
      >
        {!isUser && (
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs text-white">
              ✨
            </div>

            <span className="text-xs font-semibold text-slate-900">
              Enterprise Agent
            </span>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  )
}

export default AgentMessage