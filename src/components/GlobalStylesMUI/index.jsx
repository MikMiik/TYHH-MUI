import GlobalStyles from '@mui/material/GlobalStyles'
import globalStyles from './globalStyles'

const inputGlobalStyles = <GlobalStyles styles={globalStyles} />

export default function GlobalStylesMUI() {
  return <>{inputGlobalStyles}</>
}
