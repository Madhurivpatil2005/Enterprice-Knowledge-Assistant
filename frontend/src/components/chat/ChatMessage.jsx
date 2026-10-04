function ChatMessage({ message }) {
  const isUser =
    message.role === 'user' ||
    message.sender === 'user'

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'border bg-white text-slate-800'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {message.content ||
            message.message ||
            message.answer ||
            ''}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage