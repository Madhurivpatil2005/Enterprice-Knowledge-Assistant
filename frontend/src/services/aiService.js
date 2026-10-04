import api from './api'

export const generateSummary = async (
  documentId
) => {
  const response = await api.post(
    '/ai/summarize',
    {
      document_id: documentId,
    }
  )

  return response.data
}

export const generateKeywords = async (
  documentId
) => {
  const response = await api.post(
    '/ai/keywords',
    {
      document_id: documentId,
    }
  )

  return response.data
}

export const generateKeyPoints = async (
  documentId
) => {
  const response = await api.post(
    '/ai/key-points',
    {
      document_id: documentId,
    }
  )

  return response.data
}

export const generateFAQs = async (
  documentId
) => {
  const response = await api.post(
    '/ai/faqs',
    {
      document_id: documentId,
    }
  )

  return response.data
}

export const generateInterviewQuestions =
  async (documentId) => {
    const response = await api.post(
      '/ai/interview-questions',
      {
        document_id: documentId,
      }
    )

    return response.data
  }

export const generateSuggestedQuestions =
  async (documentId) => {
    const response = await api.post(
      '/ai/suggested-questions',
      {
        document_id: documentId,
      }
    )

    return response.data
  }