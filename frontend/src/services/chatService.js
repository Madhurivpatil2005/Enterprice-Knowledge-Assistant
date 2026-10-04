import api from './api'

export const askQuestion = async (
  question,
  conversationId = null
) => {
  const response = await api.post('/chat/ask', {
    question,
    conversation_id: conversationId,
  })

  return response.data
}

export const getConversations = async () => {
  const response = await api.get('/conversations/')
  return response.data
}

export const createConversation = async () => {
  const response = await api.post(
    '/conversations/new'
  )

  return response.data
}

export const getConversationMessages = async (
  conversationId
) => {
  const response = await api.get(
    `/conversations/${conversationId}/messages`
  )

  return response.data
}

export const renameConversation = async (
  conversationId,
  title
) => {
  const response = await api.put(
    `/conversations/${conversationId}`,
    {
      title,
    }
  )

  return response.data
}

export const deleteConversation = async (
  conversationId
) => {
  const response = await api.delete(
    `/conversations/${conversationId}`
  )

  return response.data
}