import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import { useSearchParams } from 'react-router-dom'

export default function Selection() {
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const sortOptions = {
    newest: 'Mới nhất',
    oldest: 'Cũ nhất',
    popularity: 'Phổ biến',
  }

  const handleChange = (event) => {
    const newSort = event.target.value
    const currentParams = Object.fromEntries(searchParams)
    setSearchParams({
      ...currentParams,
      sort: newSort,
    })
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel color="text.primary" id="sort">
          Sort
        </InputLabel>
        <Select
          labelId="sort"
          name="sort"
          id="sort"
          value={currentSort}
          label="sort"
          onChange={handleChange}
          sx={{
            padding: '2px 10px',
            minWidth: 180,
            maxHeight: 36,
            fontSize: 14,
            '& .MuiSelect-select': {
              padding: 1,
              minHeight: 0,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light', // màu khi hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(24, 255, 78, 0.2)',
            },
            '& .MuiSelect-icon': {
              color: theme.vars.palette.text.hint,
            },
          }}
          MenuProps={{
            disableScrollLock: true,
            marginThreshold: null,
            PaperProps: {
              sx: {
                mt: 1,
                borderRadius: 1,
                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                bgcolor: theme.vars.palette.background.light,
                '& .MuiMenu-list': {
                  p: 0,
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: theme.palette.text.primary,
                    transition: 'all 0.1s ease',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="newest">{sortOptions.newest}</MenuItem>
          <MenuItem value="oldest">{sortOptions.oldest}</MenuItem>
          <MenuItem value="popularity">{sortOptions.popularity}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
