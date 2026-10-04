// import { useEffect, useState } from 'react'

// import {
//   Users,
//   FileText,
//   MessageSquare,
//   Sparkles,
//   Activity,
//   ShieldCheck,
//   RefreshCw,
//   UserPlus,
//   UserMinus,
//   Trash2,
//   ArrowLeft,
//   Eye,
//   BarChart3,
//   Clock,
// } from 'lucide-react'

// import { useAuth } from '../context/AuthContext'

// import {
//   getAdminUsers,
//   promoteUser,
//   demoteUser,
//   deleteUser,
//   getAuditLogs,
//   getAnalyticsOverview,
//   getAnalyticsUsage,
//   getAnalyticsActivity,
//   getAdminUser,
//   getUserAnalytics,
//   getUserActivity,
//   getUserDocuments,
// } from '../services/adminService'


// function Admin() {

//   const { user } = useAuth()

//   const [users, setUsers] = useState([])
//   const [auditLogs, setAuditLogs] = useState([])
//   const [activity, setActivity] = useState([])
//   const [overview, setOverview] = useState(null)
//   const [usage, setUsage] = useState(null)

//   const [selectedUser, setSelectedUser] =
//     useState(null)

//   const [userAnalytics, setUserAnalytics] =
//     useState(null)

//   const [userDocuments, setUserDocuments] =
//     useState([])

//   const [userActivity, setUserActivity] =
//     useState([])

//   const [loading, setLoading] =
//     useState(true)

//   const [reportLoading, setReportLoading] =
//     useState(false)

//   const [actionLoading, setActionLoading] =
//     useState(false)

//   const [error, setError] =
//     useState('')

//   const [success, setSuccess] =
//     useState('')


//   const currentUserEmail =
//     user?.email?.toLowerCase()


//   // ==================================================
//   // LOAD ADMIN DATA
//   // ==================================================

//   const loadAdminData = async () => {

//     try {

//       setLoading(true)
//       setError('')

//       const [
//         usersData,
//         auditData,
//         overviewData,
//         usageData,
//         activityData,
//       ] = await Promise.all([
//         getAdminUsers(),
//         getAuditLogs(),
//         getAnalyticsOverview(),
//         getAnalyticsUsage(),
//         getAnalyticsActivity(),
//       ])

//       setUsers(
//         Array.isArray(usersData)
//           ? usersData
//           : []
//       )

//       setAuditLogs(
//         Array.isArray(auditData)
//           ? auditData
//           : auditData?.logs || []
//       )

//       setOverview(
//         overviewData || null
//       )

//       setUsage(
//         usageData || null
//       )

//       setActivity(
//         activityData?.recent_activity || []
//       )

//     } catch (error) {

//       console.error(
//         'Admin loading error:',
//         error
//       )

//       setError(
//         error?.response?.data?.detail ||
//         'Unable to load admin data.'
//       )

//     } finally {

//       setLoading(false)

//     }
//   }


//   useEffect(() => {

//     loadAdminData()

//   }, [])


//   // ==================================================
//   // VIEW / REFRESH USER REPORT
//   // ==================================================

//   const handleViewReport = async (
//     email
//   ) => {

//     try {

//       setReportLoading(true)
//       setError('')
//       setSuccess('')

//       const [
//         userData,
//         analyticsData,
//         documentsData,
//         activityData,
//       ] = await Promise.all([
//         getAdminUser(email),
//         getUserAnalytics(email),
//         getUserDocuments(email),
//         getUserActivity(email),
//       ])

//       setSelectedUser(
//         userData
//       )

//       setUserAnalytics(
//         analyticsData
//       )

//       setUserDocuments(
//         documentsData?.documents || []
//       )

//       setUserActivity(
//         activityData?.activity || []
//       )

//     } catch (error) {

//       console.error(
//         'User report error:',
//         error
//       )

//       setError(
//         error?.response?.data?.detail ||
//         'Unable to load user report.'
//       )

//     } finally {

//       setReportLoading(false)

//     }
//   }


//   // ==================================================
//   // CLOSE USER REPORT
//   // ==================================================

//   const handleBackToUsers = () => {

//     setSelectedUser(null)
//     setUserAnalytics(null)
//     setUserDocuments([])
//     setUserActivity([])
//     setError('')
//     setSuccess('')

//   }


//   // ==================================================
//   // PROMOTE
//   // ==================================================

//   const handlePromote = async (
//     email
//   ) => {

//     try {

//       setActionLoading(true)
//       setError('')
//       setSuccess('')

//       await promoteUser(email)

//       setSuccess(
//         `${email} promoted to administrator.`
//       )

//       await loadAdminData()

//     } catch (error) {

//       setError(
//         error?.response?.data?.detail ||
//         'Unable to promote user.'
//       )

//     } finally {

//       setActionLoading(false)

//     }
//   }


//   // ==================================================
//   // DEMOTE
//   // ==================================================

//   const handleDemote = async (
//     email
//   ) => {

//     if (
//       email.toLowerCase() ===
//       currentUserEmail
//     ) {
//       return
//     }

//     try {

//       setActionLoading(true)
//       setError('')
//       setSuccess('')

//       await demoteUser(email)

//       setSuccess(
//         `${email} changed to user.`
//       )

//       await loadAdminData()

//     } catch (error) {

//       setError(
//         error?.response?.data?.detail ||
//         'Unable to demote user.'
//       )

//     } finally {

//       setActionLoading(false)

//     }
//   }


//   // ==================================================
//   // DELETE
//   // ==================================================

//   const handleDelete = async (
//     email
//   ) => {

//     if (
//       email.toLowerCase() ===
//       currentUserEmail
//     ) {
//       return
//     }

//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete ${email}?`
//       )

//     if (!confirmed) {
//       return
//     }

//     try {

//       setActionLoading(true)
//       setError('')
//       setSuccess('')

//       await deleteUser(email)

//       setSuccess(
//         `${email} deleted successfully.`
//       )

//       await loadAdminData()

//     } catch (error) {

//       setError(
//         error?.response?.data?.detail ||
//         'Unable to delete user.'
//       )

//     } finally {

//       setActionLoading(false)

//     }
//   }


//   // ==================================================
//   // DATE FORMAT
//   // ==================================================

//   const formatDate = (
//     value
//   ) => {

//     if (!value) {
//       return '-'
//     }

//     try {

//       return new Date(
//         value
//       ).toLocaleString()

//     } catch {

//       return '-'

//     }
//   }


//   // ==================================================
//   // LOADING
//   // ==================================================

//   if (loading) {

//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">

//         <div className="text-center">

//           <RefreshCw
//             className="mx-auto animate-spin text-blue-600"
//             size={28}
//           />

//           <p className="mt-3 text-slate-500">
//             Loading admin dashboard...
//           </p>

//         </div>

//       </div>
//     )
//   }


//   // ==================================================
//   // USER REPORT
//   // ==================================================

//   if (selectedUser) {

//     return (

//       <div>

//         {/* Header */}

//         <div className="mb-6 flex items-center justify-between">

//           <div>

//             <button
//               onClick={handleBackToUsers}
//               disabled={reportLoading}
//               className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >

//               <ArrowLeft size={17} />

//               Back to Users

//             </button>

//             <h1 className="text-3xl font-bold text-slate-900">
//               Individual User Report
//             </h1>

//             <p className="mt-1 text-slate-500">
//               Detailed activity and usage information
//             </p>

//           </div>


//           {/* REFRESH REPORT */}

//           <button
//             onClick={() =>
//               handleViewReport(
//                 selectedUser.email
//               )
//             }
//             disabled={reportLoading}
//             className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >

//             <RefreshCw
//               size={16}
//               className={
//                 reportLoading
//                   ? 'animate-spin'
//                   : ''
//               }
//             />

//             {reportLoading
//               ? 'Refreshing...'
//               : 'Refresh Report'}

//           </button>

//         </div>


//         {error && (

//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//             {error}
//           </div>

//         )}


//         {success && (

//           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
//             {success}
//           </div>

//         )}


//         {/* User Information */}

//         <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">

//           <div className="flex items-start gap-4">

//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">

//               {selectedUser.full_name
//                 ?.charAt(0)
//                 ?.toUpperCase() || 'U'}

//             </div>

//             <div className="flex-1">

//               <h2 className="text-xl font-semibold text-slate-900">
//                 {selectedUser.full_name}
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 {selectedUser.email}
//               </p>

//               <div className="mt-3">

//                 <span
//                   className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
//                     selectedUser.role === 'admin'
//                       ? 'bg-purple-100 text-purple-700'
//                       : 'bg-slate-100 text-slate-700'
//                   }`}
//                 >

//                   {selectedUser.role === 'admin'
//                     ? 'Administrator'
//                     : 'User'}

//                 </span>

//               </div>

//             </div>

//           </div>

//         </div>


//         {/* Request Analytics */}

//         <div className="mb-8">

//           <div className="mb-4 flex items-center gap-2">

//             <BarChart3
//               size={20}
//               className="text-blue-600"
//             />

//             <h2 className="text-xl font-semibold text-slate-900">
//               Request Analytics
//             </h2>

//           </div>


//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

//             <ReportCard
//               title="Chat Requests"
//               value={
//                 userAnalytics?.chat_requests || 0
//               }
//               icon={MessageSquare}
//             />

//             <ReportCard
//               title="Summaries"
//               value={
//                 userAnalytics?.summary_requests || 0
//               }
//               icon={FileText}
//             />

//             <ReportCard
//               title="Keywords"
//               value={
//                 userAnalytics?.keyword_requests || 0
//               }
//               icon={Sparkles}
//             />

//             <ReportCard
//               title="Key Points"
//               value={
//                 userAnalytics?.key_point_requests || 0
//               }
//               icon={FileText}
//             />

//             <ReportCard
//               title="FAQs"
//               value={
//                 userAnalytics?.faq_requests || 0
//               }
//               icon={MessageSquare}
//             />

//             <ReportCard
//               title="Interview Questions"
//               value={
//                 userAnalytics?.interview_requests || 0
//               }
//               icon={Sparkles}
//             />

//             <ReportCard
//               title="Suggested Questions"
//               value={
//                 userAnalytics?.suggested_question_requests || 0
//               }
//               icon={Sparkles}
//             />

//           </div>

//         </div>


//         {/* Documents */}

//         <div className="mb-8">

//           <div className="mb-4 flex items-center gap-2">

//             <FileText
//               size={20}
//               className="text-blue-600"
//             />

//             <h2 className="text-xl font-semibold text-slate-900">
//               User Documents
//             </h2>

//             <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
//               {userDocuments.length}
//             </span>

//           </div>


//           {userDocuments.length === 0 ? (

//             <div className="rounded-xl border bg-white p-8 text-center shadow-sm">

//               <FileText
//                 className="mx-auto text-slate-300"
//                 size={40}
//               />

//               <p className="mt-3 text-slate-500">
//                 This user has not uploaded any documents.
//               </p>

//             </div>

//           ) : (

//             <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

//               <div className="divide-y">

//                 {userDocuments.map(
//                   (document) => (

//                     <div
//                       key={
//                         document.document_id
//                       }
//                       className="flex items-center justify-between px-5 py-4"
//                     >

//                       <div className="flex min-w-0 items-center gap-3">

//                         <FileText
//                           size={20}
//                           className="shrink-0 text-blue-600"
//                         />

//                         <div className="min-w-0">

//                           <p className="truncate font-medium text-slate-900">
//                             {document.filename}
//                           </p>

//                           <p className="mt-1 text-xs text-slate-500">
//                             Uploaded:{' '}
//                             {formatDate(
//                               document.uploaded_at
//                             )}
//                           </p>

//                         </div>

//                       </div>

//                     </div>

//                   )
//                 )}

//               </div>

//             </div>

//           )}

//         </div>


//         {/* User Activity */}

//         <div>

//           <div className="mb-4 flex items-center gap-2">

//             <Activity
//               size={20}
//               className="text-blue-600"
//             />

//             <h2 className="text-xl font-semibold text-slate-900">
//               Recent Activity
//             </h2>

//           </div>


//           {userActivity.length === 0 ? (

//             <div className="rounded-xl border bg-white p-8 text-center shadow-sm">

//               <Clock
//                 className="mx-auto text-slate-300"
//                 size={40}
//               />

//               <p className="mt-3 text-slate-500">
//                 No activity recorded for this user.
//               </p>

//             </div>

//           ) : (

//             <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

//               <div className="divide-y">

//                 {userActivity.map(
//                   (item) => (

//                     <div
//                       key={
//                         item.log_id
//                       }
//                       className="px-5 py-4"
//                     >

//                       <div className="flex items-start justify-between gap-4">

//                         <div>

//                           <p className="font-medium text-slate-900">
//                             {item.action}
//                           </p>

//                           <p className="mt-1 text-sm text-slate-500">
//                             {item.details ||
//                               `${item.resource_type || ''} request`}
//                           </p>

//                         </div>

//                         <p className="shrink-0 text-xs text-slate-400">
//                           {formatDate(
//                             item.created_at
//                           )}
//                         </p>

//                       </div>

//                     </div>

//                   )
//                 )}

//               </div>

//             </div>

//           )}

//         </div>

//       </div>
//     )
//   }


//   // ==================================================
//   // MAIN ADMIN DASHBOARD
//   // ==================================================

//   return (

//     <div>

//       {/* Header */}

//       <div className="mb-8 flex items-start justify-between">

//         <div>

//           <div className="flex items-center gap-3">

//             <ShieldCheck
//               size={30}
//               className="text-blue-600"
//             />

//             <h1 className="text-3xl font-bold text-slate-900">
//               Admin Dashboard
//             </h1>

//           </div>

//           <p className="mt-2 text-slate-500">
//             Manage users and monitor system activity.
//           </p>

//         </div>


//         <button
//           onClick={loadAdminData}
//           disabled={loading}
//           className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//         >

//           <RefreshCw
//             size={16}
//             className={
//               loading
//                 ? 'animate-spin'
//                 : ''
//             }
//           />

//           {loading
//             ? 'Refreshing...'
//             : 'Refresh'}

//         </button>

//       </div>


//       {error && (

//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </div>

//       )}


//       {success && (

//         <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
//           {success}
//         </div>

//       )}


//       {/* ==================================================
//           SYSTEM OVERVIEW
//       ================================================== */}

//       <div className="mb-8">

//         <h2 className="mb-4 text-xl font-semibold text-slate-900">
//           System Overview
//         </h2>


//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

//           <StatCard
//             title="Users"
//             value={
//               overview?.total_users || 0
//             }
//             icon={Users}
//           />

//           <StatCard
//             title="Documents"
//             value={
//               overview?.total_documents || 0
//             }
//             icon={FileText}
//           />

//           <StatCard
//             title="Conversations"
//             value={
//               overview?.total_conversations || 0
//             }
//             icon={MessageSquare}
//           />

//           <StatCard
//             title="Messages"
//             value={
//               overview?.total_messages || 0
//             }
//             icon={Activity}
//           />

//           <StatCard
//             title="AI Requests"
//             value={
//               overview?.total_ai_requests || 0
//             }
//             icon={Sparkles}
//           />

//         </div>

//       </div>


//       {/* ==================================================
//           USER MANAGEMENT
//       ================================================== */}

//       <div className="mb-8">

//         <div className="mb-4 flex items-center gap-2">

//           <Users
//             size={20}
//             className="text-blue-600"
//           />

//           <h2 className="text-xl font-semibold text-slate-900">
//             User Management
//           </h2>

//         </div>


//         <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

//           <table className="w-full">

//             <thead className="border-b bg-slate-50">

//               <tr>

//                 <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
//                   User
//                 </th>

//                 <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
//                   Email
//                 </th>

//                 <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
//                   Role
//                 </th>

//                 <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
//                   Created
//                 </th>

//                 <th className="px-5 py-4 text-right text-sm font-semibold text-slate-600">
//                   Actions
//                 </th>

//               </tr>

//             </thead>


//             <tbody className="divide-y">

//               {users.map(
//                 (item) => {

//                   const isCurrentUser =
//                     item.email?.toLowerCase() ===
//                     currentUserEmail

//                   return (

//                     <tr
//                       key={
//                         item.user_id
//                       }
//                       className="hover:bg-slate-50"
//                     >

//                       <td className="px-5 py-4">

//                         <div className="font-medium text-slate-900">
//                           {item.full_name}
//                         </div>

//                       </td>


//                       <td className="px-5 py-4 text-sm text-slate-600">
//                         {item.email}
//                       </td>


//                       <td className="px-5 py-4">

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-medium ${
//                             item.role === 'admin'
//                               ? 'bg-purple-100 text-purple-700'
//                               : 'bg-slate-100 text-slate-700'
//                           }`}
//                         >

//                           {item.role === 'admin'
//                             ? 'Administrator'
//                             : 'User'}

//                         </span>

//                       </td>


//                       <td className="px-5 py-4 text-sm text-slate-500">
//                         {formatDate(
//                           item.created_at
//                         )}
//                       </td>


//                       <td className="px-5 py-4">

//                         <div className="flex items-center justify-end gap-2">

//                           {/* View Report */}

//                           <button
//                             onClick={() =>
//                               handleViewReport(
//                                 item.email
//                               )
//                             }
//                             disabled={
//                               reportLoading ||
//                               actionLoading
//                             }
//                             className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
//                           >

//                             <Eye size={14} />

//                             {reportLoading
//                               ? 'Loading...'
//                               : 'View Report'}

//                           </button>


//                           {/* Promote */}

//                           {item.role !== 'admin' && (

//                             <button
//                               onClick={() =>
//                                 handlePromote(
//                                   item.email
//                                 )
//                               }
//                               disabled={
//                                 actionLoading ||
//                                 reportLoading
//                               }
//                               className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
//                             >

//                               <UserPlus size={14} />

//                               Promote

//                             </button>

//                           )}


//                           {/* Demote */}

//                           {item.role === 'admin' && (

//                             <button
//                               onClick={() =>
//                                 handleDemote(
//                                   item.email
//                                 )
//                               }
//                               disabled={
//                                 isCurrentUser ||
//                                 actionLoading ||
//                                 reportLoading
//                               }
//                               title={
//                                 isCurrentUser
//                                   ? 'You cannot demote yourself'
//                                   : 'Demote administrator'
//                               }
//                               className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
//                             >

//                               <UserMinus size={14} />

//                               Demote

//                             </button>

//                           )}


//                           {/* Delete */}

//                           <button
//                             onClick={() =>
//                               handleDelete(
//                                 item.email
//                               )
//                             }
//                             disabled={
//                               isCurrentUser ||
//                               actionLoading ||
//                               reportLoading
//                             }
//                             title={
//                               isCurrentUser
//                                 ? 'You cannot delete yourself'
//                                 : 'Delete user'
//                             }
//                             className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
//                           >

//                             <Trash2 size={14} />

//                             Delete

//                           </button>

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 }
//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>


//       {/* ==================================================
//           AI USAGE
//       ================================================== */}

//       <div className="mb-8">

//         <div className="mb-4 flex items-center gap-2">

//           <BarChart3
//             size={20}
//             className="text-blue-600"
//           />

//           <h2 className="text-xl font-semibold text-slate-900">
//             AI Usage Analytics
//           </h2>

//         </div>


//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

//           <StatCard
//             title="Chat Requests"
//             value={
//               usage?.chat_requests || 0
//             }
//             icon={MessageSquare}
//           />

//           <StatCard
//             title="Summaries"
//             value={
//               usage?.summary_requests || 0
//             }
//             icon={FileText}
//           />

//           <StatCard
//             title="Keywords"
//             value={
//               usage?.keyword_requests || 0
//             }
//             icon={Sparkles}
//           />

//           <StatCard
//             title="Key Points"
//             value={
//               usage?.key_point_requests || 0
//             }
//             icon={FileText}
//           />

//           <StatCard
//             title="FAQs"
//             value={
//               usage?.faq_requests || 0
//             }
//             icon={MessageSquare}
//           />

//           <StatCard
//             title="Interview Questions"
//             value={
//               usage?.interview_requests || 0
//             }
//             icon={Sparkles}
//           />

//           <StatCard
//             title="Suggested Questions"
//             value={
//               usage?.suggested_question_requests || 0
//             }
//             icon={Sparkles}
//           />

//         </div>

//       </div>


//       {/* ==================================================
//           RECENT ACTIVITY
//       ================================================== */}

//       <div className="mb-8">

//         <div className="mb-4 flex items-center gap-2">

//           <Activity
//             size={20}
//             className="text-blue-600"
//           />

//           <h2 className="text-xl font-semibold text-slate-900">
//             Recent Activity
//           </h2>

//         </div>


//         <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

//           {activity.length === 0 ? (

//             <div className="p-8 text-center text-sm text-slate-500">
//               No recent activity.
//             </div>

//           ) : (

//             <div className="divide-y">

//               {activity.map(
//                 (item) => (

//                   <div
//                     key={
//                       item.log_id
//                     }
//                     className="px-5 py-4"
//                   >

//                     <div className="flex items-start justify-between gap-4">

//                       <div>

//                         <p className="font-medium text-slate-900">
//                           {item.action}
//                         </p>

//                         <p className="mt-1 text-sm text-slate-500">
//                           {item.user_email}
//                         </p>

//                         {item.details && (

//                           <p className="mt-1 text-xs text-slate-400">
//                             {item.details}
//                           </p>

//                         )}

//                       </div>

//                       <p className="shrink-0 text-xs text-slate-400">
//                         {formatDate(
//                           item.created_at
//                         )}
//                       </p>

//                     </div>

//                   </div>

//                 )
//               )}

//             </div>

//           )}

//         </div>

//       </div>


//       {/* ==================================================
//           AUDIT LOGS
//       ================================================== */}

//       <div>

//         <div className="mb-4 flex items-center gap-2">

//           <ShieldCheck
//             size={20}
//             className="text-blue-600"
//           />

//           <h2 className="text-xl font-semibold text-slate-900">
//             Audit Logs
//           </h2>

//         </div>


//         <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

//           {auditLogs.length === 0 ? (

//             <div className="p-8 text-center text-sm text-slate-500">
//               No audit logs found.
//             </div>

//           ) : (

//             <div className="divide-y">

//               {auditLogs.map(
//                 (log) => (

//                   <div
//                     key={
//                       log.log_id
//                     }
//                     className="px-5 py-4"
//                   >

//                     <div className="flex items-start justify-between gap-4">

//                       <div>

//                         <p className="font-medium text-slate-900">
//                           {log.action}
//                         </p>

//                         <p className="mt-1 text-sm text-slate-500">
//                           {log.user_email}
//                         </p>

//                         {log.details && (

//                           <p className="mt-1 text-xs text-slate-400">
//                             {log.details}
//                           </p>

//                         )}

//                       </div>

//                       <p className="shrink-0 text-xs text-slate-400">
//                         {formatDate(
//                           log.created_at
//                         )}
//                       </p>

//                     </div>

//                   </div>

//                 )
//               )}

//             </div>

//           )}

//         </div>

//       </div>

//     </div>
//   )
// }


// // ==================================================
// // STAT CARD
// // ==================================================

// function StatCard({
//   title,
//   value,
//   icon: Icon,
// }) {

//   return (

//     <div className="rounded-xl border bg-white p-5 shadow-sm">

//       <div className="flex items-center justify-between">

//         <div>

//           <p className="text-sm text-slate-500">
//             {title}
//           </p>

//           <p className="mt-2 text-3xl font-bold text-slate-900">
//             {value}
//           </p>

//         </div>

//         <div className="rounded-lg bg-blue-50 p-3">

//           <Icon
//             size={22}
//             className="text-blue-600"
//           />

//         </div>

//       </div>

//     </div>
//   )
// }


// // ==================================================
// // REPORT CARD
// // ==================================================

// function ReportCard({
//   title,
//   value,
//   icon: Icon,
// }) {

//   return (

//     <div className="rounded-xl border bg-white p-5 shadow-sm">

//       <div className="flex items-center gap-3">

//         <div className="rounded-lg bg-blue-50 p-3">

//           <Icon
//             size={20}
//             className="text-blue-600"
//           />

//         </div>

//         <div>

//           <p className="text-sm text-slate-500">
//             {title}
//           </p>

//           <p className="mt-1 text-2xl font-bold text-slate-900">
//             {value}
//           </p>

//         </div>

//       </div>

//     </div>
//   )
// }


// export default Admin

import { useEffect, useState } from 'react'

import {
  Users,
  FileText,
  MessageSquare,
  Sparkles,
  Activity,
  ShieldCheck,
  RefreshCw,
  UserPlus,
  UserMinus,
  Trash2,
  ArrowLeft,
  Eye,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import {
  getAdminUsers,
  promoteUser,
  demoteUser,
  deleteUser,
  getAuditLogs,
  getAnalyticsOverview,
  getAnalyticsUsage,
  getAnalyticsActivity,
  getAdminUser,
  getUserAnalytics,
  getUserActivity,
  getUserDocuments,
} from '../services/adminService'

function Admin() {
  const { user } = useAuth()

  // ==================================================
  // MAIN ADMIN DATA
  // ==================================================

  const [users, setUsers] = useState([])
  const [overview, setOverview] = useState(null)
  const [usage, setUsage] = useState(null)

  // ==================================================
  // ACTIVITY / AUDIT
  // ==================================================

  const [activity, setActivity] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  const [showActivity, setShowActivity] = useState(false)
  const [showAuditLogs, setShowAuditLogs] = useState(false)

  const [activityLoading, setActivityLoading] = useState(false)
  const [auditLoading, setAuditLoading] = useState(false)

  // ==================================================
  // USER REPORT
  // ==================================================

  const [selectedUser, setSelectedUser] = useState(null)
  const [userAnalytics, setUserAnalytics] = useState(null)
  const [userDocuments, setUserDocuments] = useState([])
  const [userActivity, setUserActivity] = useState([])

  // ==================================================
  // UI STATE
  // ==================================================

  const [loading, setLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const currentUserEmail = user?.email?.toLowerCase()

  // ==================================================
  // LOAD MAIN ADMIN DATA
  // ==================================================

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        usersData,
        overviewData,
        usageData,
      ] = await Promise.all([
        getAdminUsers(),
        getAnalyticsOverview(),
        getAnalyticsUsage(),
      ])

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      )

      setOverview(
        overviewData || null
      )

      setUsage(
        usageData || null
      )
    } catch (error) {
      console.error(
        'Admin loading error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to load admin data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  // ==================================================
  // LOAD RECENT ACTIVITY ON DEMAND
  // ==================================================

  const handleToggleActivity = async () => {
    if (showActivity) {
      setShowActivity(false)
      return
    }

    try {
      setActivityLoading(true)
      setError('')

      const activityData =
        await getAnalyticsActivity()

      setActivity(
        activityData?.recent_activity || []
      )

      setShowActivity(true)
    } catch (error) {
      console.error(
        'Activity loading error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to load recent activity.'
      )
    } finally {
      setActivityLoading(false)
    }
  }

  // ==================================================
  // LOAD AUDIT LOGS ON DEMAND
  // ==================================================

  const handleToggleAuditLogs = async () => {
    if (showAuditLogs) {
      setShowAuditLogs(false)
      return
    }

    try {
      setAuditLoading(true)
      setError('')

      const auditData =
        await getAuditLogs()

      setAuditLogs(
        Array.isArray(auditData)
          ? auditData
          : auditData?.logs || []
      )

      setShowAuditLogs(true)
    } catch (error) {
      console.error(
        'Audit log loading error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to load audit logs.'
      )
    } finally {
      setAuditLoading(false)
    }
  }

  // ==================================================
  // VIEW USER REPORT
  // ==================================================

  const handleViewReport = async (
    email
  ) => {
    try {
      setReportLoading(true)
      setError('')
      setSuccess('')

      const [
        userData,
        analyticsData,
        documentsData,
        activityData,
      ] = await Promise.all([
        getAdminUser(email),
        getUserAnalytics(email),
        getUserDocuments(email),
        getUserActivity(email),
      ])

      setSelectedUser(
        userData
      )

      setUserAnalytics(
        analyticsData
      )

      setUserDocuments(
        documentsData?.documents || []
      )

      setUserActivity(
        activityData?.activity || []
      )
    } catch (error) {
      console.error(
        'User report error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to load user report.'
      )
    } finally {
      setReportLoading(false)
    }
  }

  // ==================================================
  // CLOSE USER REPORT
  // ==================================================

  const handleBackToUsers = () => {
    setSelectedUser(null)
    setUserAnalytics(null)
    setUserDocuments([])
    setUserActivity([])
    setError('')
    setSuccess('')
  }

  // ==================================================
  // PROMOTE
  // ==================================================

  const handlePromote = async (
    email
  ) => {
    try {
      setActionLoading(true)
      setError('')
      setSuccess('')

      await promoteUser(email)

      setSuccess(
        `${email} promoted to administrator.`
      )

      await loadAdminData()
    } catch (error) {
      console.error(
        'Promote user error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to promote user.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // ==================================================
  // DEMOTE
  // ==================================================

  const handleDemote = async (
    email
  ) => {
    if (
      email.toLowerCase() ===
      currentUserEmail
    ) {
      return
    }

    try {
      setActionLoading(true)
      setError('')
      setSuccess('')

      await demoteUser(email)

      setSuccess(
        `${email} changed to user.`
      )

      await loadAdminData()
    } catch (error) {
      console.error(
        'Demote user error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to demote user.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async (
    email
  ) => {
    if (
      email.toLowerCase() ===
      currentUserEmail
    ) {
      return
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${email}?`
      )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)
      setError('')
      setSuccess('')

      await deleteUser(email)

      setSuccess(
        `${email} deleted successfully.`
      )

      await loadAdminData()
    } catch (error) {
      console.error(
        'Delete user error:',
        error
      )

      setError(
        error?.response?.data?.detail ||
          'Unable to delete user.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return '-'
    }

    try {
      return new Date(
        value
      ).toLocaleString()
    } catch {
      return '-'
    }
  }

  // ==================================================
  // FILTER USERS
  // ==================================================

  const filteredUsers =
    users.filter((item) => {
      const search =
        searchTerm
          .trim()
          .toLowerCase()

      if (!search) {
        return true
      }

      return (
        item.full_name
          ?.toLowerCase()
          .includes(search) ||
        item.email
          ?.toLowerCase()
          .includes(search) ||
        item.role
          ?.toLowerCase()
          .includes(search)
      )
    })

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

            <RefreshCw
              size={24}
              className="animate-spin"
            />

          </div>

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading admin dashboard...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing system overview
          </p>

        </div>

      </div>
    )
  }

  // ==================================================
  // USER REPORT
  // ==================================================

  if (selectedUser) {
    return (
      <div className="space-y-7 pb-8">

        {/* HEADER */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <button
                type="button"
                onClick={
                  handleBackToUsers
                }
                disabled={
                  reportLoading
                }
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-50"
              >
                <ArrowLeft
                  size={16}
                />

                Back to Users
              </button>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <BarChart3
                    size={21}
                  />

                </div>

                <div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Individual User Report
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Detailed usage, documents,
                    and activity information.
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                handleViewReport(
                  selectedUser.email
                )
              }
              disabled={
                reportLoading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  reportLoading
                    ? 'animate-spin'
                    : ''
                }
              />

              {reportLoading
                ? 'Refreshing...'
                : 'Refresh Report'}

            </button>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <AlertBox
            type="error"
            message={error}
          />
        )}

        {/* SUCCESS */}

        {success && (
          <AlertBox
            type="success"
            message={success}
          />
        )}

        {/* USER INFORMATION */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-violet-500" />

          <div className="p-6 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-bold text-white shadow-md">

                {selectedUser.full_name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  'U'}

              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedUser.full_name}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      selectedUser.role ===
                      'admin'
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {selectedUser.role ===
                    'admin'
                      ? 'Administrator'
                      : 'User'}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedUser.email}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* REQUEST ANALYTICS */}

        <section>

          <SectionHeading
            icon={BarChart3}
            title="Request Analytics"
            description="AI usage for this user."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ReportCard
              title="Chat Requests"
              value={
                userAnalytics?.chat_requests ||
                0
              }
              icon={MessageSquare}
            />

            <ReportCard
              title="Summaries"
              value={
                userAnalytics?.summary_requests ||
                0
              }
              icon={FileText}
            />

            <ReportCard
              title="Keywords"
              value={
                userAnalytics?.keyword_requests ||
                0
              }
              icon={Sparkles}
            />

            <ReportCard
              title="Key Points"
              value={
                userAnalytics?.key_point_requests ||
                0
              }
              icon={FileText}
            />

            <ReportCard
              title="FAQs"
              value={
                userAnalytics?.faq_requests ||
                0
              }
              icon={MessageSquare}
            />

            <ReportCard
              title="Interview Questions"
              value={
                userAnalytics?.interview_requests ||
                0
              }
              icon={Sparkles}
            />

            <ReportCard
              title="Suggested Questions"
              value={
                userAnalytics?.suggested_question_requests ||
                0
              }
              icon={Sparkles}
            />

          </div>

        </section>

        {/* USER DOCUMENTS */}

        <section>

          <SectionHeading
            icon={FileText}
            title="User Documents"
            description="Documents uploaded by this user."
            badge={
              userDocuments.length
            }
          />

          {userDocuments.length ===
          0 ? (

            <EmptyPanel
              icon={FileText}
              message="This user has not uploaded any documents."
            />

          ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="divide-y divide-slate-100">

                {userDocuments.map(
                  (document) => (

                    <div
                      key={
                        document.document_id
                      }
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                          <FileText
                            size={18}
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {document.filename}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Uploaded:{' '}
                            {formatDate(
                              document.uploaded_at
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>

        {/* USER ACTIVITY */}

        <section>

          <SectionHeading
            icon={Activity}
            title="Recent Activity"
            description="Activity recorded for this user."
          />

          {userActivity.length ===
          0 ? (

            <EmptyPanel
              icon={Clock}
              message="No activity recorded for this user."
            />

          ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="divide-y divide-slate-100">

                {userActivity.map(
                  (item) => (

                    <div
                      key={
                        item.log_id
                      }
                      className="px-5 py-4"
                    >

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {item.action}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.details ||
                              `${item.resource_type || ''} request`}
                          </p>

                        </div>

                        <p className="shrink-0 text-xs text-slate-400">
                          {formatDate(
                            item.created_at
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      </div>
    )
  }

  // ==================================================
  // MAIN ADMIN DASHBOARD
  // ==================================================

  return (
    <div className="space-y-8 pb-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">

              <ShieldCheck
                size={25}
              />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Admin Dashboard
                </h1>

                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-600">
                  Administrator
                </span>

              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                Manage users, review system
                performance, and access activity
                when needed.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              loadAdminData
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            {loading
              ? 'Refreshing...'
              : 'Refresh Dashboard'}

          </button>

        </div>

      </section>

      {/* ==================================================
          ALERTS
      ================================================== */}

      {error && (
        <AlertBox
          type="error"
          message={error}
        />
      )}

      {success && (
        <AlertBox
          type="success"
          message={success}
        />
      )}

      {/* ==================================================
          SYSTEM OVERVIEW
      ================================================== */}

      <section>

        <SectionHeading
          icon={BarChart3}
          title="System Overview"
          description="Current platform-wide statistics."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            title="Users"
            value={
              overview?.total_users || 0
            }
            icon={Users}
          />

          <StatCard
            title="Documents"
            value={
              overview?.total_documents ||
              0
            }
            icon={FileText}
          />

          <StatCard
            title="Conversations"
            value={
              overview?.total_conversations ||
              0
            }
            icon={MessageSquare}
          />

          <StatCard
            title="Messages"
            value={
              overview?.total_messages ||
              0
            }
            icon={Activity}
          />

          <StatCard
            title="AI Requests"
            value={
              overview?.total_ai_requests ||
              0
            }
            icon={Sparkles}
          />

        </div>

      </section>

      {/* ==================================================
          USER MANAGEMENT
      ================================================== */}

      <section>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <SectionHeading
            icon={Users}
            title="User Management"
            description="Manage accounts and view individual reports."
            badge={users.length}
          />

          <div className="relative w-full sm:w-72">

            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search users..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-slate-100 bg-slate-50/80">

                <tr>

                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center"
                    >

                      <Users
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No users found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try a different search term.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (item) => {

                      const isCurrentUser =
                        item.email?.toLowerCase() ===
                        currentUserEmail

                      const userInitial =
                        item.full_name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                        'U'

                      return (
                        <tr
                          key={
                            item.user_id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                                {userInitial}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {item.full_name}
                                </p>

                                {isCurrentUser && (
                                  <span className="mt-0.5 inline-flex text-[10px] font-medium text-blue-600">
                                    You
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {item.email}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                item.role ===
                                'admin'
                                  ? 'bg-violet-50 text-violet-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.role ===
                              'admin'
                                ? 'Administrator'
                                : 'User'}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(
                              item.created_at
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewReport(
                                    item.email
                                  )
                                }
                                disabled={
                                  reportLoading ||
                                  actionLoading
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                <Eye
                                  size={14}
                                />

                                View Report

                              </button>

                              {item.role !==
                                'admin' && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePromote(
                                      item.email
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    reportLoading
                                  }
                                  className="inline-flex items-center justify-center rounded-lg bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                                  title="Promote to administrator"
                                >

                                  <UserPlus
                                    size={15}
                                  />

                                </button>

                              )}

                              {item.role ===
                                'admin' && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDemote(
                                      item.email
                                    )
                                  }
                                  disabled={
                                    isCurrentUser ||
                                    actionLoading ||
                                    reportLoading
                                  }
                                  title={
                                    isCurrentUser
                                      ? 'You cannot demote yourself'
                                      : 'Demote administrator'
                                  }
                                  className="inline-flex items-center justify-center rounded-lg bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                  <UserMinus
                                    size={15}
                                  />

                                </button>

                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    item.email
                                  )
                                }
                                disabled={
                                  isCurrentUser ||
                                  actionLoading ||
                                  reportLoading
                                }
                                title={
                                  isCurrentUser
                                    ? 'You cannot delete yourself'
                                    : 'Delete user'
                                }
                                className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                <Trash2
                                  size={15}
                                />

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

      {/* ==================================================
          AI USAGE
      ================================================== */}

      <section>

        <SectionHeading
          icon={Sparkles}
          title="AI Usage Analytics"
          description="Platform-wide AI request usage."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Chat Requests"
            value={
              usage?.chat_requests || 0
            }
            icon={MessageSquare}
          />

          <StatCard
            title="Summaries"
            value={
              usage?.summary_requests || 0
            }
            icon={FileText}
          />

          <StatCard
            title="Keywords"
            value={
              usage?.keyword_requests || 0
            }
            icon={Sparkles}
          />

          <StatCard
            title="Key Points"
            value={
              usage?.key_point_requests || 0
            }
            icon={FileText}
          />

          <StatCard
            title="FAQs"
            value={
              usage?.faq_requests || 0
            }
            icon={MessageSquare}
          />

          <StatCard
            title="Interview Questions"
            value={
              usage?.interview_requests ||
              0
            }
            icon={Sparkles}
          />

          <StatCard
            title="Suggested Questions"
            value={
              usage?.suggested_question_requests ||
              0
            }
            icon={Sparkles}
          />

        </div>

      </section>

      {/* ==================================================
          ACTIVITY & SECURITY
      ================================================== */}

      <section>

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

            <ShieldCheck
              size={18}
            />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Activity & Security
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Detailed system records are available when needed.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* ================================================
              RECENT ACTIVITY
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <button
              type="button"
              onClick={
                handleToggleActivity
              }
              className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                  <Activity
                    size={18}
                  />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h3 className="text-sm font-bold text-slate-900">
                      Recent Activity
                    </h3>

                    {showActivity &&
                      activity.length > 0 && (

                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                          {activity.length}
                        </span>

                      )}

                  </div>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    Recent actions across the platform
                  </p>

                </div>

              </div>

              <div className="flex shrink-0 items-center gap-2">

                {activityLoading ? (

                  <RefreshCw
                    size={16}
                    className="animate-spin text-blue-600"
                  />

                ) : (

                  <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 transition group-hover:border-blue-200 group-hover:text-blue-600">

                    {showActivity
                      ? 'Hide'
                      : 'View'}

                    {showActivity ? (
                      <ChevronUp
                        size={14}
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                      />
                    )}

                  </span>

                )}

              </div>

            </button>

            {showActivity && (

              <div className="border-t border-slate-100 bg-slate-50/40">

                {activity.length ===
                0 ? (

                  <div className="px-5 py-8 text-center">

                    <Activity
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      No recent activity found.
                    </p>

                  </div>

                ) : (

                  <div className="max-h-80 overflow-y-auto">

                    {activity.map(
                      (item) => (

                        <div
                          key={
                            item.log_id
                          }
                          className="border-b border-slate-100 px-5 py-3.5 last:border-b-0"
                        >

                          <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm ring-1 ring-slate-100">

                              <Activity
                                size={13}
                              />

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">

                                <p className="text-xs font-semibold text-slate-700">
                                  {item.action}
                                </p>

                                <span className="shrink-0 text-[10px] text-slate-400">
                                  {formatDate(
                                    item.created_at
                                  )}
                                </span>

                              </div>

                              {item.user_email && (

                                <p className="mt-1 text-[11px] text-slate-500">
                                  {item.user_email}
                                </p>

                              )}

                              {item.details && (

                                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                                  {item.details}
                                </p>

                              )}

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

          {/* ================================================
              AUDIT LOGS
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <button
              type="button"
              onClick={
                handleToggleAuditLogs
              }
              className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                  <ShieldCheck
                    size={18}
                  />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h3 className="text-sm font-bold text-slate-900">
                      Audit Logs
                    </h3>

                    {showAuditLogs &&
                      auditLogs.length > 0 && (

                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                          {auditLogs.length}
                        </span>

                      )}

                  </div>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    Administrative and security records
                  </p>

                </div>

              </div>

              <div className="flex shrink-0 items-center gap-2">

                {auditLoading ? (

                  <RefreshCw
                    size={16}
                    className="animate-spin text-violet-600"
                  />

                ) : (

                  <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 transition group-hover:border-violet-200 group-hover:text-violet-600">

                    {showAuditLogs
                      ? 'Hide'
                      : 'View'}

                    {showAuditLogs ? (
                      <ChevronUp
                        size={14}
                      />
                    ) : (
                      <ChevronDown
                        size={14}
                      />
                    )}

                  </span>

                )}

              </div>

            </button>

            {showAuditLogs && (

              <div className="border-t border-slate-100 bg-slate-50/40">

                {auditLogs.length ===
                0 ? (

                  <div className="px-5 py-8 text-center">

                    <ShieldCheck
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      No audit logs found.
                    </p>

                  </div>

                ) : (

                  <div className="max-h-80 overflow-y-auto">

                    {auditLogs.map(
                      (log) => (

                        <div
                          key={
                            log.log_id
                          }
                          className="border-b border-slate-100 px-5 py-3.5 last:border-b-0"
                        >

                          <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-violet-500 shadow-sm ring-1 ring-slate-100">

                              <ShieldCheck
                                size={13}
                              />

                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">

                                <p className="text-xs font-semibold text-slate-700">
                                  {log.action}
                                </p>

                                <span className="shrink-0 text-[10px] text-slate-400">
                                  {formatDate(
                                    log.created_at
                                  )}
                                </span>

                              </div>

                              {log.user_email && (

                                <p className="mt-1 text-[11px] text-slate-500">
                                  {log.user_email}
                                </p>

                              )}

                              {log.details && (

                                <p className="mt-1 text-[11px] leading-5 text-slate-400">
                                  {log.details}
                                </p>

                              )}

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  )
}

// ==================================================
// SECTION HEADING
// ==================================================

function SectionHeading({
  icon: Icon,
  title,
  description,
  badge,
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon
            size={18}
          />

        </div>

        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            {badge !==
              undefined && (

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                {badge}
              </span>

            )}

          </div>

          {description && (

            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>

          )}

        </div>

      </div>

    </div>
  )
}

// ==================================================
// ALERT BOX
// ==================================================

function AlertBox({
  type,
  message,
}) {
  const isSuccess =
    type === 'success'

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-sm ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >

      {isSuccess ? (

        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0"
        />

      ) : (

        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0"
        />

      )}

      <div>

        <p className="text-sm font-semibold">
          {isSuccess
            ? 'Success'
            : 'Something went wrong'}
        </p>

        <p className="mt-0.5 text-xs">
          {message}
        </p>

      </div>

    </div>
  )
}

// ==================================================
// EMPTY PANEL
// ==================================================

function EmptyPanel({
  icon: Icon,
  message,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">

      <Icon
        size={34}
        className="mx-auto text-slate-300"
      />

      <p className="mt-3 text-sm text-slate-500">
        {message}
      </p>

    </div>
  )
}

// ==================================================
// STAT CARD
// ==================================================

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-200 group-hover:scale-105">

          <Icon
            size={20}
          />

        </div>

      </div>

    </div>
  )
}

// ==================================================
// REPORT CARD
// ==================================================

function ReportCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

          <Icon
            size={19}
          />

        </div>

        <div className="min-w-0">

          <p className="truncate text-xs text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>
      </div>
    </div>
  )
}

export default Admin