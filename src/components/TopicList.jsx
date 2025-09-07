import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

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
            bgcolor: '#fff',
            borderRadius: 1,
            boxShadow: '4px 4px 15px 0 #eaebea',
          }}
        >
          <Box
            component="span"
            sx={{
              color: '#F37021',
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
          <Link
            to={`/topics/${item.slug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            {item.title}
          </Link>
        </Box>
      ))}
    </Stack>
  )
}

export default TopicList
