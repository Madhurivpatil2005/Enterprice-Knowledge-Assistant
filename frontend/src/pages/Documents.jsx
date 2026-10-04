// import { useEffect, useState } from 'react'
// import {
//   Search,
//   FileText,
//   Eye,
//   Download,
//   Trash2,
//   Pencil,
//   X,
//   Check,
//   MoreVertical,
// } from 'lucide-react'

// import {
//   getDocuments,
//   uploadDocument,
//   searchDocuments,
//   deleteDocument,
//   downloadDocument,
//   updateDocument,
//   getDocument,
// } from '../services/documentService'

// import DocumentDetails from '../components/documents/DocumentDetails'

// function Documents() {
//   const [documents, setDocuments] = useState([])

//   const [loading, setLoading] = useState(true)
//   const [uploading, setUploading] = useState(false)
//   const [renaming, setRenaming] = useState(false)

//   const [searchQuery, setSearchQuery] = useState('')

//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')

//   const [renameOpen, setRenameOpen] = useState(false)
//   const [renameId, setRenameId] = useState('')
//   const [renameValue, setRenameValue] = useState('')
//   const [openMenuId, setOpenMenuId] = useState(null)
//   const [selectedDocument, setSelectedDocument] =
//     useState(null)

//   const [detailsLoading, setDetailsLoading] =
//     useState(false)

//   // Load documents
//   const loadDocuments = async () => {
//     try {
//       setLoading(true)
//       setError('')

//       const data = await getDocuments()

//       const items = Array.isArray(data)
//         ? data
//         : data?.items || []

//       setDocuments(items)
//     } catch (error) {
//       console.error(
//         'Document loading error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to load documents.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadDocuments()
//   }, [])

//   // Upload document
//   const handleUpload = async (event) => {
//     const file = event.target.files?.[0]

//     if (!file) {
//       return
//     }

//     try {
//       setUploading(true)
//       setError('')
//       setSuccess('')

//       await uploadDocument(file)

//       setSuccess(
//         'Document uploaded successfully.'
//       )

//       await loadDocuments()
//     } catch (error) {
//       console.error(
//         'Document upload error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to upload document.'
//       )
//     } finally {
//       setUploading(false)

//       event.target.value = ''
//     }
//   }

//   // Search documents
//   const handleSearch = async () => {
//     const query = searchQuery.trim()

//     if (!query) {
//       await loadDocuments()
//       return
//     }

//     try {
//       setLoading(true)
//       setError('')
//       setSuccess('')

//       const data = await searchDocuments(query)

//       const items = Array.isArray(data)
//         ? data
//         : data?.items || []

//       setDocuments(items)
//     } catch (error) {
//       console.error(
//         'Document search error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to search documents.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Open rename modal
//   const openRename = (
//     documentId,
//     filename
//   ) => {
//     setRenameId(documentId)
//     setRenameValue(filename)
//     setRenameOpen(true)

//     setError('')
//     setSuccess('')
//   }

//   // Close rename modal
//   const closeRename = () => {
//     if (renaming) {
//       return
//     }

//     setRenameOpen(false)
//     setRenameId('')
//     setRenameValue('')
//   }

//   // Rename document
//   const handleRename = async () => {
//     const newName = renameValue.trim()

//     if (!newName) {
//       setError('Please enter a filename.')
//       return
//     }

//     try {
//       setRenaming(true)
//       setError('')
//       setSuccess('')

//       await updateDocument(
//         renameId,
//         newName
//       )

//       setDocuments((currentDocuments) =>
//         currentDocuments.map((document) => {
//           const documentId =
//             document.document_id ||
//             document.id ||
//             document._id

//           if (
//             String(documentId) ===
//             String(renameId)
//           ) {
//             return {
//               ...document,
//               filename: newName,
//               file_name: newName,
//               name: newName,
//             }
//           }

//           return document
//         })
//       )

//       setSuccess(
//         'Document renamed successfully.'
//       )

//       setRenameOpen(false)
//       setRenameId('')
//       setRenameValue('')
//     } catch (error) {
//       console.error(
//         'Document rename error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to rename document.'
//       )
//     } finally {
//       setRenaming(false)
//     }
//   }

//   // Delete document
//   const handleDelete = async (
//     documentId
//   ) => {
//     const confirmed = window.confirm(
//       'Are you sure you want to delete this document?'
//     )

//     if (!confirmed) {
//       return
//     }

//     try {
//       setError('')
//       setSuccess('')

//       await deleteDocument(documentId)

//       setDocuments((currentDocuments) =>
//         currentDocuments.filter((document) => {
//           const id =
//             document.document_id ||
//             document.id ||
//             document._id

//           return (
//             String(id) !==
//             String(documentId)
//           )
//         })
//       )

//       setSuccess(
//         'Document deleted successfully.'
//       )
//     } catch (error) {
//       console.error(
//         'Document delete error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to delete document.'
//       )
//     }
//   }

//   // Download document
//   const handleDownload = async (
//     documentId,
//     filename
//   ) => {
//     try {
//       setError('')

//       const response =
//         await downloadDocument(
//           documentId
//         )

//       const blob = new Blob([
//         response.data,
//       ])

//       const url =
//         window.URL.createObjectURL(blob)

//       const link =
//         document.createElement('a')

//       link.href = url
//       link.download =
//         filename || 'document'

//       document.body.appendChild(link)

//       link.click()

//       link.remove()

//       window.URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error(
//         'Document download error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to download document.'
//       )
//     }
//   }

//   // View document details
//   const handleView = async (
//     documentId
//   ) => {
//     try {
//       setDetailsLoading(true)
//       setError('')
//       setSuccess('')

//       const data = await getDocument(
//         documentId
//       )

//       setSelectedDocument(data)
//     } catch (error) {
//       console.error(
//         'Document details error:',
//         error
//       )

//       setError(
//         error.response?.data?.detail ||
//           'Unable to load document details.'
//       )
//     } finally {
//       setDetailsLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Documents
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Upload, search and manage your
//             documents.
//           </p>
//         </div>

//         <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
//           {uploading
//             ? 'Uploading...'
//             : 'Upload Document'}

//           <input
//             type="file"
//             className="hidden"
//             onChange={handleUpload}
//             disabled={uploading}
//           />
//         </label>
//       </div>

//       {/* Success message */}
//       {success && (
//         <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//           <Check size={18} />

//           <span>{success}</span>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {/* Search */}
//       <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <div className="relative flex-1">
//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(event) =>
//                 setSearchQuery(
//                   event.target.value
//                 )
//               }
//               onKeyDown={(event) => {
//                 if (
//                   event.key === 'Enter'
//                 ) {
//                   handleSearch()
//                 }
//               }}
//               placeholder="Search documents by filename..."
//               className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             Search
//           </button>

//           {searchQuery && (
//             <button
//               onClick={() => {
//                 setSearchQuery('')
//                 loadDocuments()
//               }}
//               className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Documents */}
//       <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//           <div>
//             <h2 className="font-semibold text-slate-900">
//               Your Documents
//             </h2>

//             <p className="mt-1 text-xs text-slate-500">
//               {documents.length} document
//               {documents.length !== 1
//                 ? 's'
//                 : ''}
//             </p>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex items-center justify-center px-5 py-12">
//             <div className="text-sm text-slate-500">
//               Loading documents...
//             </div>
//           </div>
//         ) : documents.length === 0 ? (
//           /* Empty state */
//           <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
//             <div className="mb-4 rounded-full bg-slate-100 p-4">
//               <FileText
//                 size={28}
//                 className="text-slate-400"
//               />
//             </div>

//             <h3 className="font-medium text-slate-800">
//               No documents found
//             </h3>

//             <p className="mt-1 max-w-sm text-sm text-slate-500">
//               Upload a document to start
//               using the knowledge assistant.
//             </p>
//           </div>
//         ) : (
//           /* Document list */
//           <div className="divide-y divide-slate-100">
//             {documents.map(
//               (document, index) => {
//                 const documentId =
//                   document.document_id ||
//                   document.id ||
//                   document._id

//                 const filename =
//                   document.filename ||
//                   document.file_name ||
//                   document.name ||
//                   `Document ${index + 1}`

//                 return (
//                   <div
//                     key={String(
//                       documentId ||
//                         index
//                     )}
//                     className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
//                   >
//                     {/* Document information */}
//                     <div className="flex min-w-0 items-center gap-3">
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
//                         <FileText
//                           size={20}
//                           className="text-blue-600"
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <p
//                           className="truncate font-medium text-slate-800"
//                           title={filename}
//                         >
//                           {filename}
//                         </p>

//                         {document.uploaded_at && (
//                           <p className="mt-1 text-xs text-slate-400">
//                             Uploaded{' '}
//                             {new Date(
//                               document.uploaded_at
//                             ).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex flex-wrap items-center gap-2">
//                       {/* View */}
//                       <button
//                         onClick={() =>
//                           handleView(
//                             documentId
//                           )
//                         }
//                         disabled={detailsLoading}
//                         className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                         <Eye size={15} />
//                         {detailsLoading
//                           ? 'Loading...'
//                           : 'View'}
//                       </button>

//                       {/* Download */}
//                       <button
//                         onClick={() =>
//                           handleDownload(
//                             documentId,
//                             filename
//                           )
//                         }
//                         className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
//                       >
//                         <Download
//                           size={15}
//                         />
//                         Download
//                       </button>

//                       {/* Rename */}
//                       <button
//                         onClick={() =>
//                           openRename(
//                             documentId,
//                             filename
//                           )
//                         }
//                         className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
//                       >
//                         <Pencil size={15} />
//                         Rename
//                       </button>

//                       {/* Delete */}
//                       <button
//                         onClick={() =>
//                           handleDelete(
//                             documentId
//                           )
//                         }
//                         className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
//                       >
//                         <Trash2
//                           size={15}
//                         />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 )
//               }
//             )}
//           </div>
//         )}
//       </div>

//       {/* Rename Modal */}
//       {renameOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
//             {/* Modal header */}
//             <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//               <h3 className="font-semibold text-slate-900">
//                 Rename Document
//               </h3>

//               <button
//                 onClick={closeRename}
//                 disabled={renaming}
//                 className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Modal body */}
//             <div className="px-5 py-5">
//               <label className="mb-2 block text-sm font-medium text-slate-700">
//                 Filename
//               </label>

//               <input
//                 type="text"
//                 value={renameValue}
//                 onChange={(event) =>
//                   setRenameValue(
//                     event.target.value
//                   )
//                 }
//                 onKeyDown={(event) => {
//                   if (
//                     event.key === 'Enter'
//                   ) {
//                     handleRename()
//                   }
//                 }}
//                 autoFocus
//                 disabled={renaming}
//                 className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//               />
//             </div>

//             {/* Modal footer */}
//             <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
//               <button
//                 onClick={closeRename}
//                 disabled={renaming}
//                 className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleRename}
//                 disabled={
//                   renaming ||
//                   !renameValue.trim()
//                 }
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {renaming
//                   ? 'Renaming...'
//                   : 'Rename'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Document Details */}
//       {selectedDocument && (
//         <DocumentDetails
//           document={selectedDocument}
//           onClose={() =>
//             setSelectedDocument(null)
//           }
//         />
//       )}
//     </div>
//   )
// }

// export default Documents

import { useEffect, useState } from 'react'
import {
  Search,
  FileText,
  Eye,
  Download,
  Trash2,
  Pencil,
  X,
  Check,
  MoreVertical,
} from 'lucide-react'

import {
  getDocuments,
  uploadDocument,
  searchDocuments,
  deleteDocument,
  downloadDocument,
  updateDocument,
} from '../services/documentService'

import api from '../services/api'

import DocumentDetails from '../components/documents/DocumentDetails'

function Documents() {
  const [documents, setDocuments] = useState([])

  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [renaming, setRenaming] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [renameOpen, setRenameOpen] = useState(false)
  const [renameId, setRenameId] = useState('')
  const [renameValue, setRenameValue] = useState('')

  // More actions menu
  const [openMenuId, setOpenMenuId] = useState(null)

  // Selected document for View modal
  const [selectedDocument, setSelectedDocument] =
    useState(null)

  // Load documents
  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getDocuments()

      const items = Array.isArray(data)
        ? data
        : data?.items || []

      setDocuments(items)
    } catch (error) {
      console.error(
        'Document loading error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to load documents.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const handleAgentDocumentChanged = (
    event
  ) => {
    const {
      type,
      document,
    } = event.detail || {}

    if (!type || !document) {
      return
    }

    setDocuments((previous) => {
      const documentId =
        document.document_id ||
        document.id ||
        document._id

      if (!documentId) {
        return previous
      }

      if (type === 'renamed') {
  return previous.map(
    (item) => {
      const itemId =
        item.document_id ||
        item.id ||
        item._id

      const changedDocumentId =
        document.document_id ||
        document.id ||
        document._id

      if (
        String(itemId) ===
        String(changedDocumentId)
      ) {
        return {
          ...item,
          filename:
            document.filename,
        }
      }

      return item
    }
  )
}

      if (type === 'deleted') {
        return previous.filter(
          (item) => {
            const itemId =
              item.document_id ||
              item.id ||
              item._id

            return (
              String(itemId) !==
              String(documentId)
            )
          }
        )
      }

      return previous
    })
  }

  window.addEventListener(
    'agent:document-changed',
    handleAgentDocumentChanged
  )

  return () => {
    window.removeEventListener(
      'agent:document-changed',
      handleAgentDocumentChanged
    )
  }
}, [])

  useEffect(() => {
    loadDocuments()
  }, [])

  // Upload document
  const handleUpload = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      await uploadDocument(file)

      setSuccess(
        'Document uploaded successfully.'
      )

      await loadDocuments()
    } catch (error) {
      console.error(
        'Document upload error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to upload document.'
      )
    } finally {
      setUploading(false)

      event.target.value = ''
    }
  }

  // Search documents
  const handleSearch = async () => {
    const query = searchQuery.trim()

    if (!query) {
      await loadDocuments()
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const data = await searchDocuments(query)

      const items = Array.isArray(data)
        ? data
        : data?.items || []

      setDocuments(items)
    } catch (error) {
      console.error(
        'Document search error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to search documents.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Open rename modal
  const openRename = (
    documentId,
    filename
  ) => {
    setRenameId(documentId)
    setRenameValue(filename)
    setRenameOpen(true)

    setOpenMenuId(null)

    setError('')
    setSuccess('')
  }

  // Close rename modal
  const closeRename = () => {
    if (renaming) {
      return
    }

    setRenameOpen(false)
    setRenameId('')
    setRenameValue('')
  }

  // Rename document
  const handleRename = async () => {
    const newName = renameValue.trim()

    if (!newName) {
      setError('Please enter a filename.')
      return
    }

    try {
      setRenaming(true)
      setError('')
      setSuccess('')

      await updateDocument(
        renameId,
        newName
      )

      setDocuments((currentDocuments) =>
        currentDocuments.map((document) => {
          const documentId =
            document.document_id ||
            document.id ||
            document._id

          if (
            String(documentId) ===
            String(renameId)
          ) {
            return {
              ...document,
              filename: newName,
              file_name: newName,
              name: newName,
            }
          }

          return document
        })
      )

      setSuccess(
        'Document renamed successfully.'
      )

      setRenameOpen(false)
      setRenameId('')
      setRenameValue('')
    } catch (error) {
      console.error(
        'Document rename error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to rename document.'
      )
    } finally {
      setRenaming(false)
    }
  }

  // Delete document
  const handleDelete = async (
    documentId
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this document?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await deleteDocument(documentId)

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => {
          const id =
            document.document_id ||
            document.id ||
            document._id

          return (
            String(id) !==
            String(documentId)
          )
        })
      )

      setSuccess(
        'Document deleted successfully.'
      )
    } catch (error) {
      console.error(
        'Document delete error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to delete document.'
      )
    }
  }

  // Download document
  const handleDownload = async (
    documentId,
    filename
  ) => {
    try {
      setError('')

      const response =
        await downloadDocument(
          documentId
        )

      const blob = new Blob([
        response.data,
      ])

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url
      link.download =
        filename || 'document'

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(
        'Document download error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to download document.'
      )
    }
  }

  // View document details
  const handleView = async (
    documentId
  ) => {
    try {
      setError('')
      setSuccess('')

      setOpenMenuId(null)

      const response = await api.get(
        `/documents/${documentId}`
      )

      setSelectedDocument(
        response.data
      )
    } catch (error) {
      console.error(
        'Document view error:',
        error
      )

      setError(
        error.response?.data?.detail ||
          'Unable to view document.'
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Documents
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Upload, search and manage your
            documents.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
          {uploading
            ? 'Uploading...'
            : 'Upload Document'}

          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={18} />

          <span>{success}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter'
                ) {
                  handleSearch()
                }
              }}
              placeholder="Search documents by filename..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Search
          </button>

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                loadDocuments()
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Your Documents
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {documents.length} document
              {documents.length !== 1
                ? 's'
                : ''}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center px-5 py-12">
            <div className="text-sm text-slate-500">
              Loading documents...
            </div>
          </div>
        ) : documents.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4">
              <FileText
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="font-medium text-slate-800">
              No documents found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Upload a document to start
              using the knowledge assistant.
            </p>
          </div>
        ) : (
          /* Document list */
          <div className="divide-y divide-slate-100">
            {documents.map(
              (document, index) => {
                const documentId =
                  document.document_id ||
                  document.id ||
                  document._id

                const filename =
                  document.filename ||
                  document.file_name ||
                  document.name ||
                  `Document ${index + 1}`

                return (
                  <div
                    key={String(
                      documentId ||
                        index
                    )}
                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    {/* Document information */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <FileText
                          size={20}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="truncate font-medium text-slate-800"
                          title={filename}
                        >
                          {filename}
                        </p>

                        {document.uploaded_at && (
                          <p className="mt-1 text-xs text-slate-400">
                            Uploaded{' '}
                            {new Date(
                              document.uploaded_at
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          handleView(
                            documentId
                          )
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      {/* More Actions */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId ===
                                documentId
                                ? null
                                : documentId
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                          aria-label="More actions"
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>

                        {openMenuId ===
                          documentId && (
                          <div className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                            {/* Download */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                handleDownload(
                                  documentId,
                                  filename
                                )
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <Download
                                size={16}
                                className="text-slate-500"
                              />

                              Download
                            </button>

                            {/* Rename */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                openRename(
                                  documentId,
                                  filename
                                )
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil
                                size={16}
                                className="text-slate-500"
                              />

                              Rename
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                )

                                handleDelete(
                                  documentId
                                )
                              }}
                              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2
                                size={16}
                              />

                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {renameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="font-semibold text-slate-900">
                Rename Document
              </h3>

              <button
                type="button"
                onClick={closeRename}
                disabled={renaming}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filename
              </label>

              <input
                type="text"
                value={renameValue}
                onChange={(event) =>
                  setRenameValue(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter'
                  ) {
                    handleRename()
                  }
                }}
                autoFocus
                disabled={renaming}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeRename}
                disabled={renaming}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRename}
                disabled={
                  renaming ||
                  !renameValue.trim()
                }
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {renaming
                  ? 'Renaming...'
                  : 'Rename'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <DocumentDetails
          document={selectedDocument}
          onClose={() =>
            setSelectedDocument(null)
          }
        />
      )}
    </div>
  )
}

export default Documents