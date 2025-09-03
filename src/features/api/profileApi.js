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
  }),
})

export const { useGetOneProfileQuery, useUpdateProfileMutation } = profileApi
