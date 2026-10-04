import { FileText } from 'lucide-react'

function SourceList({ sources = [] }) {
  if (!sources.length) {
    return null
  }

  return (
    <div className="mt-3 rounded-lg border bg-slate-50 p-3">

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Sources
      </p>

      <div className="space-y-2">

        {sources.map((source, index) => (
          <div
            key={`${source.filename}-${source.chunk_number}-${index}`}
            className="flex items-center gap-2 text-sm text-slate-700"
          >

            <FileText
              size={15}
              className="shrink-0 text-blue-600"
            />

            <span>
              {source.filename}
            </span>

            <span className="text-xs text-slate-400">
              Chunk {source.chunk_number}
            </span>

          </div>
        ))}

      </div>

    </div>
  )
}

export default SourceList