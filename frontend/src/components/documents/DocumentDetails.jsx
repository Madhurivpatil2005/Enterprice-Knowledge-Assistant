import {
  X,
  FileText,
  User,
  Calendar,
  Hash,
} from 'lucide-react'

function DocumentDetails({
  document,
  onClose,
}) {
  if (!document) {
    return null
  }

  const uploadedDate =
    document.uploaded_at
      ? new Date(
          document.uploaded_at
        ).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  /*
   * Prefer user_name if the backend provides it.
   * Until then, use a clean fallback instead of
   * displaying the email as the person's name.
   */
  const userName =
    document.user_name ||
    document.name ||
    ''

  const userEmail =
    document.user_email || '—'

  const documentId =
    document.document_id ||
    document.id ||
    '—'

  const filename =
    document.filename ||
    'Document'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <FileText
                size={23}
                strokeWidth={2}
                className="text-blue-600"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Document
              </p>

              <h2
                className="mt-1 truncate text-xl font-semibold text-slate-900"
                title={filename}
              >
                {filename}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">

        {/* Uploaded By */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <User
                  size={18}
                  className="text-slate-500"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Uploaded by
                </p>

                {userName ? (
                  <>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {userName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 truncate text-sm font-medium text-slate-700">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Date */}
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Calendar
                  size={18}
                  className="text-slate-500"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Uploaded
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {uploadedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Document ID */}
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <Hash
                  size={18}
                  className="text-slate-500"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Document ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {documentId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentDetails