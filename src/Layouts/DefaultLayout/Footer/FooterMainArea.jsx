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
            <Typography>
              Tôi Yêu Hóa Học (tyhh.net) <br /> Trực thuộc Công ty cổ phần Công nghệ và Giáo Dục Hoc 68
            </Typography>
          </ListItem>

          <ListItem>
            <ArticleOutlinedIcon sx={{ mr: 1.8 }}></ArticleOutlinedIcon>
            <Typography>Mã số thuế: 0109410068</Typography>
          </ListItem>

          <ListItem>
            <RoomOutlinedIcon sx={{ mr: 1.8 }}></RoomOutlinedIcon>
            <Typography>
              Tầng 2, số 19, N7B, KĐT Trung Hòa - Nhân Chính, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội
            </Typography>
          </ListItem>

          <ListItem>
            <EmailOutlinedIcon sx={{ mr: 1.8 }}></EmailOutlinedIcon>
            <Typography>thanh.k47ftu@gmail.com</Typography>
          </ListItem>

          <ListItem>
            <LocalPhoneOutlinedIcon sx={{ mr: 1.8 }}></LocalPhoneOutlinedIcon>
            <Typography>086.546.9889</Typography>
          </ListItem>
        </ListItemStack>
      </Stack>
    </>
  )
}

export default FooterMainArea
