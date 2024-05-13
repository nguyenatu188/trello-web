import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { Avatar, IconButton, Tooltip } from '@mui/material'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'

function Profile() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
      <Tooltip title='Account Settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36 }}
            alt='me'
            src='https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-1/441053115_1113273573233184_8331344882763273818_n.jpg?stp=dst-jpg_s200x200&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH0xyXj9c4_vsyjt6wVPMDYaZUWEb6_c_9plRYRvr9z_0xOaWRIkhhjxD1SPV-M5dHcjYc4wciWAY4YT9Ei5XNv&_nc_ohc=i__jr0Qf8lsQ7kNvgFX5Ek0&_nc_ht=scontent.fhan5-2.fna&oh=00_AfDinn5lMLp6x3tl_jcv_FPEP6VfzagmG6-9UBaPIa3zPQ&oe=6640AF57'/>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profile"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile'
        }}
      >
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }}/> Profile
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }}/> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile
