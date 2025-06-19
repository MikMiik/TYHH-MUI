import { Container, Divider } from '@mui/material'
import FooterMainArea from './FooterMainArea'
import FooterBottomArea from './FooterBottomArea'

function Footer() {
  return (
    <Container maxWidth={true} disableGutters sx={{ bgcolor: 'primary.main', minHeight: '630px' }}>
      <FooterMainArea />
      <Divider sx={{ borderColor: 'white' }}></Divider>
      <FooterBottomArea></FooterBottomArea>
    </Container>
  )
}

export default Footer
