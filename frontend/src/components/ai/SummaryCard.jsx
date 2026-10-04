import { FileText } from 'lucide-react'

function SummaryCard({
  summary,
  filename,
}) {
  if (!summary) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      <div className="flex items-center gap-3 border-b px-6 py-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText size={20} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            Document Summary
          </h3>

          {filename && (
            <p className="text-xs text-slate-500">
              {filename}
            </p>
          )}
        </div>

      </div>

      <div className="whitespace-pre-wrap px-6 py-5 text-sm leading-7 text-slate-700">
        {summary}
      </div>

    </div>
  )
}

export default SummaryCard