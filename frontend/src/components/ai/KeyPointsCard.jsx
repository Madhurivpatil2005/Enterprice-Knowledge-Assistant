function KeyPointsCard({
  keyPoints = [],
}) {
  if (!keyPoints.length) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 font-semibold text-slate-900">
        Key Points
      </h3>

      <ol className="space-y-3">

        {keyPoints.map(
          (point, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-6 text-slate-700"
            >

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                {index + 1}
              </span>

              <span>
                {point}
              </span>

            </li>
          )
        )}

      </ol>

    </div>
  )
}

export default KeyPointsCard