import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

const TopicList = ({ items = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSlug = searchParams.get('topic')
  return (
    <Stack spacing={1}>
      {items.map((item, idx) => {
        const isActive = activeSlug === item.slug
        return (
          <Box
            key={idx}
            p={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: (theme) => theme.vars?.palette?.background?.light || theme.palette.background.light,
              borderRadius: 1,
              boxShadow: '4px 4px 15px 0 #eaebea',
              cursor: 'pointer',
              transition: 'color 0.2s',
              color: isActive ? 'primary.main' : 'inherit',
              '&:hover .topic-title': {
                color: 'primary.main',
              },
            }}
            onClick={() => setSearchParams({ topic: item.slug })}
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
            <Box
              className="topic-title"
              sx={{
                textDecoration: 'none',
                color: isActive ? 'primary.dark' : 'inherit',
                fontWeight: 560,
                fontSize: '1rem',
                transition: 'color 0.2s',
              }}
            >
              {item.title}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export default TopicList
