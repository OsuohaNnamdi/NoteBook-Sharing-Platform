import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
  ListItemIcon,
  Typography
} from "@mui/material";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Header = (props) => {
  // State for the profile menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Retrieve user's profile information from localStorage
  const userProfile = JSON.parse(localStorage.getItem('profile')) || {};
  const fullName = userProfile.fullName || '';
  const email = userProfile.email || '';
  const schoolId = userProfile.schoolId || '';

  // Extract the first letter of the first and last names, capitalize them
  const initials = fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');

  return (
    <AppBar sx={props.sx} elevation={0} className={props.customClass}>
      <Toolbar>
        {/* Left side content, if any */}
        <Box flexGrow={1}>
          {/* Placeholder for any content on the left side */}
        </Box>

        {/* Profile Dropdown */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 'auto' // Push the avatar to the far right
          }}
        >
          <Button
            aria-label="menu"
            color="inherit"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 30,
                height: 30,
                backgroundColor: 'primary.main',
                color: 'white'
              }}
            >
              {initials}
            </Avatar>
          </Button>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            sx={{
              "& .MuiMenu-paper": {
                width: "250px",
                right: 0,
                top: "70px !important",
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  backgroundColor: 'primary.main',
                  color: 'white'
                }}
              >
                {initials}
              </Avatar>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Typography>{fullName}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Email:
                </Typography>
              </ListItemIcon>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {email}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  School ID:
                </Typography>
              </ListItemIcon>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {schoolId}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              localStorage.clear(); // Clear local storage on logout
              window.location.reload(); // Reload the page
            }}>
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
