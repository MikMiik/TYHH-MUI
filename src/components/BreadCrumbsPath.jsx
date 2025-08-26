import Breadcrumbs from '@mui/material/Breadcrumbs'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Typography } from '@mui/material'
import MuiLink from './MuiLink'

function handleClick() {
  console.log('click')
}
const breadcrumbs = [
  { link: '/', label: 'Home', key: '1' },
  { link: '/courses', label: 'Courses', key: '2' },
]
export default function BreadCrumbsPath() {
  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs.map((item, index) =>
          index < breadcrumbs.length - 1 ? (
            <MuiLink key={item.key} to={item.link} underline="hover" color="rgb(97, 97, 97)" onClick={handleClick}>
              {item.label}
            </MuiLink>
          ) : (
            <Typography key={item.key} color="tertiary.main">
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Stack>
  )
}
