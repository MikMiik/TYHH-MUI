import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState } from 'react'

export default function Selection() {
  const [sort, setSort] = useState('Mới nhất')

  const handleChange = (event) => {
    setSort(event.target.value)
  }

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="sort">Sort</InputLabel>
        <Select
          labelId="sort"
          name="sort"
          id="sort"
          value={sort}
          label="sort"
          onChange={handleChange}
          sx={{
            padding: '2px 10px',
            minWidth: 180,
            fontSize: 14,
            color: '#000000a6',
            '& .MuiSelect-select': {
              padding: 1,
              minHeight: 0,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'secondary.light', // màu khi hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'secondary.main',
              boxShadow: '0 0 0 2px rgba(24,144,255,.2)',
            },
            '& .MuiSelect-icon': {
              color: '#c4c4c4',
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
                bgcolor: '#fff',
                '& .MuiMenu-list': {
                  p: 0,
                },
                '& .MuiMenuItem-root': {
                  fontSize: 14,
                  '&:hover': {
                    bgcolor: 'secondary.light',
                    color: '#fff',
                    transition: 'all 0.1s ease',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value={'Mới nhất'}>Mới nhất</MenuItem>
          <MenuItem value={'Cũ nhất'}>Cũ nhất</MenuItem>
          <MenuItem value={'Phổ biến'}>Phổ biến</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
