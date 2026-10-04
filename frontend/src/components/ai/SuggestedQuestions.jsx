function SuggestedQuestions({
  questions = [],
  onQuestionClick,
}) {
  if (!questions.length) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 font-semibold text-slate-900">
        Suggested Questions
      </h3>

      <div className="space-y-2">

        {questions.map(
          (question, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                onQuestionClick?.(
                  question
                )
              }
              className="block w-full rounded-lg border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {question}
            </button>
          )
        )}

      </div>

    </div>
  )
}

export default SuggestedQuestions