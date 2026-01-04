import LogoIcon from '@/components/LogoIcon'
import fbIcon from '@/assets/images/fbIcon.png'
import youtubeIcon from '@/assets/images/youtubeicon.png'
import tiktokIcon from '@/assets/images/tiktokIcon.png'

import { Box, Stack, Typography, Link } from '@mui/material'
import { useGetSocialsQuery } from '@/features/api/siteInfoApi'

function FooterBottomArea() {
  const { data: socials, isSuccess: socialsLoaded } = useGetSocialsQuery()
  return (
    <Stack
      direction={{
        md: 'row',
        xs: 'column',
      }}
      sx={{ color: 'white' }}
      justifyContent="space-between"
      flexWrap="wrap"
      spacing={2}
      minWidth={{
        xs: '100%',
        sm: '540px',
        md: '880px',
        lg: '1140px',
      }}
    >
      <Box
        sx={{
          minWidth: 260,
          maxWidth: 340,
          bgcolor: 'rgba(255,255,255,0.08)',
          borderRadius: 2,
          p: 2.5,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mb: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="body1" fontStyle="italic" color="white" mb={1.5} lineHeight={1.7}>
          "Hóa học là chiếc chìa khóa mở ra cánh cửa của sự sống." 🧪
        </Typography>
        <Typography variant="caption" color="grey.300" fontWeight={600} textAlign="right" width="100%">
          – Marie Curie –
        </Typography>
      </Box>

      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography sx={{ mb: 1 }}>© Bản quyền thuộc về ... | Cung cấp bởi</Typography>
        <Link href="https://www.facebook.com/hoan.phi.79" target="_blank">
          Team
        </Link>
      </Stack>

      {/* Socials */}
      <Stack direction="row" spacing={3} my={2} alignItems="center" justifyContent="center">
        {socialsLoaded &&
          socials.map((social) => (
            <Link key={social.id} href={social.url} target="_blank">
              <Stack direction="row" alignItems="center" spacing={1} key={social.id}>
                {(() => {
                  switch (social.platform) {
                    case 'facebook':
                      return <LogoIcon color="white" size={30} src={fbIcon} />
                    case 'youtube':
                      return <LogoIcon color="white" size={30} src={youtubeIcon} />
                    case 'tiktok':
                      return <LogoIcon color="white" size={30} src={tiktokIcon} />
                    default:
                      return null
                  }
                })()}
              </Stack>
            </Link>
          ))}
      </Stack>
    </Stack>
  )
}

export default FooterBottomArea
