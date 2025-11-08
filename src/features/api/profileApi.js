import { baseApi } from './baseApi'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneProfile: builder.query({
      query: (userId) => `users/${userId}`,
      transformResponse: (response) => response.data,
      providesTags: ['Profile'],
    }),
   
    updateProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadAvatar: builder.mutation({
      query: ({ userId, avatar }) => ({
        url: `users/${userId}/upload-avatar`,
        method: 'POST',
        body: { avatar },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetOneProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } = profileApi
