import { baseApi } from './baseApi'

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMockPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/mock',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Course', 'User', 'Enrollment'],
    }),
    getMockReceipt: builder.query({
      query: (paymentId) => `/payments/mock/receipt/${paymentId}`,
      providesTags: (result, error, paymentId) => [{ type: 'Payment', id: paymentId }],
    }),
    getUserPayments: builder.query({
      query: () => '/payments/history',
      providesTags: ['Payment'],
    }),
    checkEnrollment: builder.query({
      query: (courseId) => `/payments/enrollment/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: 'Enrollment', id: courseId }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateMockPaymentMutation,
  useGetMockReceiptQuery,
  useGetUserPaymentsQuery,
  useCheckEnrollmentQuery,
} = paymentsApi
