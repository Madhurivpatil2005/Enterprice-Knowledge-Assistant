import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function FAQCard({
  faqs = [],
}) {
  const [openIndex, setOpenIndex] =
    useState(null)

  if (!faqs.length) {
    return null
  }

  const toggleFAQ = (index) => {
    setOpenIndex(
      openIndex === index
        ? null
        : index
    )
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 font-semibold text-slate-900">
        Frequently Asked Questions
      </h3>

      <div className="space-y-3">

        {faqs.map(
          (faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-slate-200"
            >

              <button
                type="button"
                onClick={() =>
                  toggleFAQ(index)
                }
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50"
              >

                <span className="text-sm font-medium text-slate-800">
                  {faq.question}
                </span>

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
                  {faq.answer}
                </div>
              )}

            </div>
          )
        )}

      </div>

    </div>
  )
}

export default FAQCard