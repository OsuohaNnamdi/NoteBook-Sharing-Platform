import React from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import { Box, Drawer, useMediaQuery, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import image from "../Logo/logos.jpeg";
import Menuitems from "./data";

const Sidebar = (props) => {
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };


  const userType = localStorage.getItem('TYPE') || localStorage.getItem('TYPES') || 'guest';
  const menuItems = Menuitems[userType.toLowerCase()] || Menuitems.guest;
  console.log(localStorage.getItem('TYPES'))
  console.log(localStorage.getItem('TYPE'))


  const SidebarContent = (
    <Box sx={{ p: 3, height: "calc(100vh - 40px)" }}>
      <Link to="/">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={image}
          alt="Logo" 
          id="logo" 
          style={{
           width: '230px',  
           height: '170px',  
          }} />
        </Box>
      </Link>

      <Box>
        <List sx={{ mt: 4 }}>
          {menuItems.map((item, index) => (
            <List component="li" disablePadding key={item.title}>
              <ListItem
                onClick={() => handleClick(index)}
                button
                component={NavLink}
                to={item.href}
                selected={pathDirect === item.href}
                sx={{
                  mb: 1,
                  ...(pathDirect === item.href && {
                    color: "white",
                    backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    ...(pathDirect === item.href && { color: "white" }),
                  }}
                >
                  <item.icon width="20" height="20" />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </List>
          ))}
        </List>
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props.isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: 240,
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      PaperProps={{
        sx: {
          width: 240,
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;
