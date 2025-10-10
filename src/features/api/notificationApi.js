import { baseApi } from './baseApi'

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => '/notifications',
      transformResponse: (response) => response.data,
      providesTags: ['Notification'],
    }),
    getNotificationsByTeacher: builder.query({
      query: (teacherId) => `/notifications/teacher/${teacherId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, teacherId) => [
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
  }),
})

export const {
  useGetAllNotificationsQuery,
  useGetNotificationsByTeacherQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi
