import { baseApi } from './baseApi'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneProfile: builder.query({
      query: (userId) => `users/${userId}`,
      transformResponse: (response) => response.data,
    }),
    updateProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response) => response.data,
    }),
    uploadAvatar: builder.mutation({
      query: ({ userId, avatar }) => ({
        url: `users/${userId}/upload-avatar`,
        method: 'POST',
        body: { avatar },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
})

export const { useGetOneProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } = profileApi
