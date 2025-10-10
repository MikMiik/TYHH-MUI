import { baseApi } from './baseApi'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: '/notifications',
        params: { page, limit, search },
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Notification'],
    }),
    getNotificationsByTeacher: builder.query({
      query: ({ teacherId, page = 1, limit = 10, search = '' }) => ({
        url: `/notifications/teacher/${teacherId}`,
        params: { page, limit, search },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, { teacherId }) => [
        { type: 'Notification', id: 'TEACHER' },
        { type: 'Notification', id: teacherId },
      ],
    }),
    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: '/notifications/teacher/create',
        method: 'POST',
        body: notificationData, // { title, message, teacherId }
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/teacher/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Notification'],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/mark-read`,
        method: 'POST',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetAllNotificationsQuery,
  useGetNotificationsByTeacherQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi
