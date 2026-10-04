import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function InterviewCard({
  questions = [],
}) {
  const [openIndex, setOpenIndex] =
    useState(null)

  if (!questions.length) {
    return null
  }

  const toggleQuestion = (index) => {
    setOpenIndex(
      openIndex === index
        ? null
        : index
    )
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 font-semibold text-slate-900">
        Interview Questions
      </h3>

      <div className="space-y-3">

        {questions.map(
          (item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-slate-200"
            >

              <button
                type="button"
                onClick={() =>
                  toggleQuestion(index)
                }
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50"
              >

                <div className="flex gap-3">

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    {index + 1}
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {item.question}
                  </span>

                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-500 transition ${
                    openIndex === index
                      ? 'rotate-180'
                      : ''
                  }`}
                />

              </button>

              {openIndex === index && (
                <div className="border-t bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  <p className="mb-1 font-medium text-slate-700">
                    Expected Answer
                  </p>

                  {item.expected_answer}
                </div>
              )}

            </div>
          )
        )}

      </div>

    </div>
  )
}

export default InterviewCard