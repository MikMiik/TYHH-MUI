import { Box, Container, Stack, Typography, TextField, InputAdornment } from '@mui/material'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import BreadCrumbsPath from '@/components/BreadCrumbsPath'
import Selection from '@/components/Selection'
import TopicList from '@/components/TopicList'
import { useGetAllTopicsQuery } from '@/features/api/topicApi'
import useResponsive from '@/hooks/useResponsive'
import useDebounce from '@/hooks/useDebounce'

function MenuLayout() {
  const { isMobile } = useResponsive()
  const { data: topics = [], isSuccess } = useGetAllTopicsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // Update URL params when debounced search value changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    if (debouncedSearchValue.trim()) {
      newParams.set('search', debouncedSearchValue.trim())
    } else {
      newParams.delete('search')
    }

    setSearchParams(newParams, { replace: true })
  }, [debouncedSearchValue, searchParams, setSearchParams])

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  return (
    <Container sx={{ py: 2 }}>
      <BreadCrumbsPath />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent={{ sm: 'space-between' }}
        spacing={{ xs: 2, sm: 0 }}
        my={2}
      >
        {!isMobile && (
          <Typography variant="subtitle1" fontWeight={600} my={2}>
            DANH MỤC
          </Typography>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            sx={{
              minWidth: { xs: '100%', sm: '250px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey.300',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 2px rgba(24, 255, 147, 0.2)',
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 'fit-content' }}>
            <Typography variant="subtitle2">Sắp xếp</Typography>
            <Selection />
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row">
        {!isMobile && (
          <Box flex="0 0 25%" maxWidth="25%">
            <TopicList items={isSuccess ? topics : []} />
          </Box>
        )}

        <Outlet />
      </Stack>
      <Box mt={4}>
        <img src="banner.png" alt="banner" style={{ width: '100%' }} />
      </Box>
    </Container>
  )
}

export default MenuLayout
