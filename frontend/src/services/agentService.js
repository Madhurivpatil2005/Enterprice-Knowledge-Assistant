import api from './api'

export const sendAgentCommand = async (
  command,
  currentPage = null
) => {
  const response = await api.post(
    '/agent/command',
    {
      command,
      current_page: currentPage,
    }
  )

  return response.data
}