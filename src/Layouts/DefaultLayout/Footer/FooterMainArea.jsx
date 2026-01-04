import LogoIcon from '@/components/LogoIcon'
import logoImg from '@/assets/images/mainlogo.png'

import { ListItem, Stack, Typography } from '@mui/material'
import HomeFilledIcon from '@mui/icons-material/HomeFilled'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import ListItemStack from '@/components/ListItemStack'

function FooterMainArea() {
  return (
    <>
      <LogoIcon size={126} src={logoImg} />

      <Stack
        direction={{
          md: 'row',
          xs: 'column',
        }}
        spacing={2}
        sx={{ mt: 4, color: 'white' }}
      >
        <ListItemStack spacing={4} sx={{ flex: 2, '& .MuiListItem-root': { display: 'flex' } }}>
          <ListItem>
            <HomeFilledIcon sx={{ mr: 1.8 }}></HomeFilledIcon>
            <Typography>Tôi Yêu Hóa Học (tyhh.online)</Typography>
          </ListItem>

          <ListItem>
            <ArticleOutlinedIcon sx={{ mr: 1.8 }}></ArticleOutlinedIcon>
            <Typography>Mã số thuế: </Typography>
          </ListItem>

          <ListItem>
            <RoomOutlinedIcon sx={{ mr: 1.8 }}></RoomOutlinedIcon>
            <Typography>Hà Nội</Typography>
          </ListItem>

          <ListItem>
            <EmailOutlinedIcon sx={{ mr: 1.8 }}></EmailOutlinedIcon>
            <Typography>tyhh@gmail.com</Typography>
          </ListItem>

          <ListItem>
            <LocalPhoneOutlinedIcon sx={{ mr: 1.8 }}></LocalPhoneOutlinedIcon>
            <Typography>012.345.6789</Typography>
          </ListItem>
        </ListItemStack>
      </Stack>
    </>
  )
}

export default FooterMainArea
