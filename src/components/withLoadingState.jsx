import LoadingState from './LoadingState'

/**
 * Higher-Order Component để wrap các RTK Query hooks với LoadingState
 * @param {function} useQueryHook - RTK Query hook (như useGetCoursesQuery)
 * @param {object} options - Tùy chọn cấu hình
 * @returns {function} - Component đã được wrap
 */
export function withLoadingState(useQueryHook, options = {}) {
  return function QueryWrapper(queryParams = {}, hookOptions = {}) {
    const {
      loadingText = 'Đang tải dữ liệu...',
      emptyText = 'Không có dữ liệu để hiển thị',
      variant = 'section',
      skeletonType = 'text',
      skeletonCount = 3,
      dataKey = null, // Key để trích xuất data từ response
      hasDataCheck = null, // Custom function để check có data không
      ...loadingStateProps
    } = options

    const queryResult = useQueryHook(queryParams, hookOptions)
    const { data, isLoading, error, refetch } = queryResult

    // Extract actual data if dataKey is provided
    const actualData = dataKey ? data?.[dataKey] : data

    // Check if has data
    let hasData = true
    if (hasDataCheck) {
      hasData = hasDataCheck(actualData)
    } else if (Array.isArray(actualData)) {
      hasData = actualData.length > 0
    } else {
      hasData = Boolean(actualData)
    }

    return {
      ...queryResult,
      LoadingStateComponent: ({ children, ...props }) => (
        <LoadingState
          isLoading={isLoading}
          error={error}
          hasData={hasData}
          loadingText={loadingText}
          emptyText={emptyText}
          variant={variant}
          skeletonType={skeletonType}
          skeletonCount={skeletonCount}
          onRetry={refetch}
          {...loadingStateProps}
          {...props}
        >
          {children}
        </LoadingState>
      ),
    }
  }
}

/**
 * Hook đơn giản để sử dụng LoadingState với RTK Query
 * @param {object} queryResult - Kết quả từ RTK Query hook
 * @param {object} options - Tùy chọn cấu hình LoadingState
 * @returns {object} - Object chứa component LoadingState và query result
 */
export function useLoadingState(queryResult, options = {}) {
  const {
    loadingText = 'Đang tải dữ liệu...',
    emptyText = 'Không có dữ liệu để hiển thị',
    variant = 'section',
    dataKey = null,
    hasDataCheck = null,
    ...loadingStateProps
  } = options

  const { data, isLoading, error, refetch } = queryResult

  // Extract actual data if dataKey is provided
  const actualData = dataKey ? data?.[dataKey] : data

  // Check if has data
  let hasData = true
  if (hasDataCheck) {
    hasData = hasDataCheck(actualData)
  } else if (Array.isArray(actualData)) {
    hasData = actualData.length > 0
  } else {
    hasData = Boolean(actualData)
  }

  const LoadingStateComponent = ({ children, ...props }) => (
    <LoadingState
      isLoading={isLoading}
      error={error}
      hasData={hasData}
      loadingText={loadingText}
      emptyText={emptyText}
      variant={variant}
      onRetry={refetch}
      {...loadingStateProps}
      {...props}
    >
      {children}
    </LoadingState>
  )

  return {
    ...queryResult,
    LoadingStateComponent,
    actualData,
  }
}
