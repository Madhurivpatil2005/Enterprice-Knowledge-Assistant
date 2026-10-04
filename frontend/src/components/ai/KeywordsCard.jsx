function KeywordsCard({
  keywords = [],
}) {
  if (!keywords.length) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 font-semibold text-slate-900">
        Keywords
      </h3>

      <div className="flex flex-wrap gap-2">

        {keywords.map(
          (keyword, index) => (
            <span
              key={`${keyword}-${index}`}
              className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            >
              {keyword}
            </span>
          )
        )}

      </div>

    </div>
  )
}

export default KeywordsCard