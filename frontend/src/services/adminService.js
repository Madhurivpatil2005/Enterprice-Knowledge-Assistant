import api from './api'


// ==================================================
// GET ALL USERS
// ==================================================

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data
}


// ==================================================
// GET USER DETAILS
// ==================================================

export const getAdminUser = async (email) => {
  const response = await api.get(
    `/admin/users/${encodeURIComponent(email)}`
  )

  return response.data
}


// ==================================================
// PROMOTE USER
// ==================================================

export const promoteUser = async (email) => {
  const response = await api.put(
    `/admin/users/${encodeURIComponent(email)}/promote`
  )

  return response.data
}


// ==================================================
// DEMOTE USER
// ==================================================

export const demoteUser = async (email) => {
  const response = await api.put(
    `/admin/users/${encodeURIComponent(email)}/demote`
  )

  return response.data
}


// ==================================================
// DELETE USER
// ==================================================

export const deleteUser = async (email) => {
  const response = await api.delete(
    `/admin/users/${encodeURIComponent(email)}`
  )

  return response.data
}


// ==================================================
// GLOBAL AUDIT LOGS
// ==================================================

export const getAuditLogs = async () => {
  const response = await api.get(
    '/admin/audit-logs'
  )

  return response.data
}


// ==================================================
// GLOBAL ANALYTICS OVERVIEW
// ==================================================

export const getAnalyticsOverview = async () => {
  const response = await api.get(
    '/admin/analytics/overview'
  )

  return response.data
}


// ==================================================
// GLOBAL ANALYTICS USAGE
// ==================================================

export const getAnalyticsUsage = async () => {
  const response = await api.get(
    '/admin/analytics/usage'
  )

  return response.data
}


// ==================================================
// GLOBAL ANALYTICS ACTIVITY
// ==================================================

export const getAnalyticsActivity = async () => {
  const response = await api.get(
    '/admin/analytics/activity'
  )

  return response.data
}


// ==================================================
// INDIVIDUAL USER ANALYTICS
// ==================================================

export const getUserAnalytics = async (email) => {
  const response = await api.get(
    `/admin/users/${encodeURIComponent(email)}/analytics`
  )

  return response.data
}


// ==================================================
// INDIVIDUAL USER ACTIVITY
// ==================================================

export const getUserActivity = async (email) => {
  const response = await api.get(
    `/admin/users/${encodeURIComponent(email)}/activity`
  )

  return response.data
}


// ==================================================
// INDIVIDUAL USER DOCUMENTS
// ==================================================

export const getUserDocuments = async (email) => {
  const response = await api.get(
    `/admin/users/${encodeURIComponent(email)}/documents`
  )

  return response.data
}