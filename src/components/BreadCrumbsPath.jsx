import Breadcrumbs from '@mui/material/Breadcrumbs'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Typography } from '@mui/material'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import MuiLink from './MuiLink'

export default function BreadCrumbsPath({ customBreadcrumbs = null, customData = {}, showOnHomePage = false }) {
  const autoBreadcrumbs = useBreadcrumb(customData)

  // Use custom breadcrumbs if provided, otherwise use auto-generated ones
  const breadcrumbs = customBreadcrumbs || autoBreadcrumbs

  // Don't render if no breadcrumbs or only home (unless showOnHomePage is true)
  if (!showOnHomePage && breadcrumbs.length <= 1) {
    return null
  }

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs.map((item, index) =>
          index < breadcrumbs.length - 1 ? (
            <MuiLink
              key={item.key}
              to={item.link}
              color="rgb(97, 97, 97)"
              sx={{
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'tertiary.main',
                },
              }}
            >
              {item.label}
            </MuiLink>
          ) : (
            <Typography
              key={item.key}
              color="tertiary.main"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Stack>
  )
}
