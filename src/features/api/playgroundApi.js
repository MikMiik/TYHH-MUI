import { baseApi } from './baseApi'

export const playgroundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllElements: builder.query({
      query: () => 'playground/elements',
      transformResponse: (response) => response.data,
    }),
    getUserEntities: builder.query({
      query: () => 'playground/entities',
      transformResponse: (response) => response.data,
      providesTags: ['PlaygroundEntities'],
    }),
    combineElements: builder.mutation({
      query: ({ element1, element2 }) => ({
        url: 'playground/combine',
        method: 'POST',
        body: { element1, element2 },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['PlaygroundEntities'],
    }),
    removeUserEntity: builder.mutation({
      query: (entityId) => ({
        url: `playground/entities/${entityId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['PlaygroundEntities'],
    }),
  }),
})

export const {
  useGetAllElementsQuery,
  useGetUserEntitiesQuery,
  useCombineElementsMutation,
  useRemoveUserEntityMutation,
} = playgroundApi
