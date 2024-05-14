import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="atus board"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Puclic/Private Workspace"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          onClick={() => {}}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          onClick={() => {}}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite</Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='atus1'>
            <Avatar
              alt="atus1"
              src='https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-1/441053115_1113273573233184_8331344882763273818_n.jpg?stp=dst-jpg_s200x200&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH0xyXj9c4_vsyjt6wVPMDYaZUWEb6_c_9plRYRvr9z_0xOaWRIkhhjxD1SPV-M5dHcjYc4wciWAY4YT9Ei5XNv&_nc_ohc=i__jr0Qf8lsQ7kNvgFX5Ek0&_nc_ht=scontent.fhan5-2.fna&oh=00_AfDinn5lMLp6x3tl_jcv_FPEP6VfzagmG6-9UBaPIa3zPQ&oe=6640AF57' />
          </Tooltip>
          <Tooltip title='atus2'>
            <Avatar
              alt="atus2"
              src='https://lh3.googleusercontent.com/ogw/AF2bZyhOLRH13k6xMdktDlReEbk1pl4CBvFGM6q4_Eh0tsMKqkE=s64-c-mo' />
          </Tooltip>
          <Tooltip title='atus3'>
            <Avatar
              alt="atus3"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFcBstBgp4MDOoVqKbTUiCiso2H55p0AlGyjYfnmnQCUWq11BBgDQO2kJ6IbB9m_9-ezKydZU7TDTNQDAYOYhiF&_nc_ohc=_TdP1EsHjHgQ7kNvgFtJZOU&_nc_ht=scontent.fhan5-9.fna&oh=00_AfDm63RGhKajJzuiWXoyHfgLtexGy8SYzJOuD6LULcD4mg&oe=6663C838' />
          </Tooltip>
          <Tooltip title='atus4'>
            <Avatar
              alt="atus4"
              src='data:image/jpeg;base64,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' />
          </Tooltip>
          <Tooltip title='atus5'>
            <Avatar
              alt="atus5"
              src='https://scontent.fhan5-11.fna.fbcdn.net/v/t39.30808-1/432764007_1829485640850831_1168723740198770326_n.jpg?stp=c33.0.200.200a_dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGglBDIRM4uy3wpSzk-h5hqMoYZ6b9DXlMyhhnpv0NeUwodGIK0-q4NO52FXE0FngJuVAHIKlKfER6ufmtdIJOH&_nc_ohc=P8N9S0ijOlUQ7kNvgGH0vWP&_nc_ht=scontent.fhan5-11.fna&oh=00_AfBCnIwe0ffZkZFtTwyPrc7Kl7DSB_caol-wi3ssgswiOw&oe=664233D3' />
          </Tooltip>
          <Tooltip title='atus6'>
            <Avatar
              alt="atus6"
              src='https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-1/440935469_3756670864573595_8255300062370585877_n.jpg?stp=dst-jpg_p200x200&_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF1iGV5IfWrBSxxWUe8dnf6yry4MjLSckLKvLgyMtJyQizsnS2ztS8cWrjwDQ5jg70b0gwLuh8Rjo6kyJfaS9hY&_nc_ohc=0Ct0uP9b1x0Q7kNvgEBlFps&_nc_ht=scontent.fhan5-6.fna&oh=00_AfCOqFY_oRPtiAhL6CaoRUYOMONdUthYKoPeRtU_RbSrAQ&oe=6642297A' />
          </Tooltip>
          <Tooltip title='atus7'>
            <Avatar
              alt="atus7"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t1.6435-1/144362011_1299264013800438_9195507134475682567_n.jpg?stp=dst-jpg_p200x200&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHVscjGm1mDMNjfHfXwVHjwx5fBZNrBpPrHl8Fk2sGk-rDhHkBOQ7ZQ433M0unEb9SDsoE_G8N5SdKRXqrhfJ7Q&_nc_ohc=s_JRYnHUdBUQ7kNvgH_skzC&_nc_ht=scontent.fhan5-9.fna&oh=00_AfC02RgfxwHzesT9hXTRHYCOwafIvOB0YGFxWo3Bq2ejoQ&oe=6663BF61' />
          </Tooltip>
          <Tooltip title='atus8'>
            <Avatar
              alt="atus8"
              src='https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/ufo-aliens-tree-ufo-night-star-towery-hill.jpg' />
          </Tooltip>
          <Tooltip title='atus9'>
            <Avatar
              alt="atus9"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFcBstBgp4MDOoVqKbTUiCiso2H55p0AlGyjYfnmnQCUWq11BBgDQO2kJ6IbB9m_9-ezKydZU7TDTNQDAYOYhiF&_nc_ohc=_TdP1EsHjHgQ7kNvgFtJZOU&_nc_ht=scontent.fhan5-9.fna&oh=00_AfDm63RGhKajJzuiWXoyHfgLtexGy8SYzJOuD6LULcD4mg&oe=6663C838' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
