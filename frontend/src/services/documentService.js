import api from './api'

export const getDocuments = async () => {
  const response = await api.get('/documents/')
  return response.data
}

export const uploadDocument = async (file) => {
  const formData = new FormData()

  formData.append('file', file)

  const response = await api.post(
    '/documents/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const searchDocuments = async (query) => {
  const response = await api.get(
    '/documents/search/',
    {
      params: {
        filename: query,
      },
    }
  )

  return response.data
}

export const getDocumentStats = async () => {
  const response = await api.get(
    '/documents/stats'
  )

  return response.data
}

export const getDocument = async (documentId) => {
  const response = await api.get(
    `/documents/${documentId}`
  )

  return response.data
}


// ==================================================
// RENAME DOCUMENT
// ==================================================

export const updateDocument = async (
  documentId,
  filename
) => {
  const response = await api.put(
    `/documents/${documentId}`,
    {
      filename,
    }
  )

  return response.data
}


export const deleteDocument = async (documentId) => {
  const response = await api.delete(
    `/documents/${documentId}`
  )

  return response.data
}

export const downloadDocument = async (
  documentId
) => {
  const response = await api.get(
    `/documents/download/${documentId}`,
    {
      responseType: 'blob',
    }
  )

  return response
}