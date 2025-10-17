import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import MuiLink from './MuiLink'

const TopicList = ({ items = [] }) => {
  return (
    <Stack spacing={1}>
      {items.map((item, idx) => (
        <Box
          key={idx}
          p={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: (theme) => theme.palette.background.default,
            borderRadius: 1,
            boxShadow: '4px 4px 15px 0 #eaebea',
          }}
        >
          <Box
            component="span"
            sx={{
              color: (theme) => theme.palette.warning.orange,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              mr: 1.5,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M8 5L10 7L8 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <MuiLink
            variant="subtitle2"
            fontWeight={500}
            sx={{
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {item}
          </MuiLink>
        </Box>
      ))}
    </Stack>
  )
}

export default TopicList
