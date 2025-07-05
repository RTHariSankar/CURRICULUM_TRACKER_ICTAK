import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import Typography from "@mui/material/Typography";
import { useNavigate } from 'react-router-dom';
import { Avatar, Stack } from "@mui/material";
import logo from '../images/ictak.png';
const drawerWidth = 240;

const Sidebar = () => {
  const userId = sessionStorage.getItem('userId');
  const admin = sessionStorage.getItem("admin");
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const reqFormNav = () => {
    if (admin === 'true') {
      navigate('/reqForm');
    } else {
      alert('Only admin has access to this feature');
    }
  };

  const AdminView = () => {
    if (admin === 'true') {
      navigate('/admin');
    } else {
      alert('Only admin has access to this feature');
    }
  };

  const facultyPage = () => {
    navigate('/faculty');
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: '#f9f9f9', // Light background for the sidebar
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Logo and Title Section */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="center" 
          spacing={1} 
          sx={{ 
            py: 2, 
            px: 2,
            borderBottom: '1px solid #e0e0e0' // Subtle divider
          }}
        >
          <Avatar 
            src={logo} 
            alt="ICTAK Logo" 
            variant="square"
            sx={{ 
              width: 36, 
              height: 36,
              borderRadius: '4px',
              objectFit: 'contain'
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: '#6439ff',
              fontSize: '1.25rem'
            }}
          >
            ICTAK
          </Typography>
        </Stack>

        <Toolbar /> {/* Spacer */}
        
        {/* Main Navigation Items */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={reqFormNav}>
              <ListItemIcon>
                <InsertDriveFileIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Requirement Form" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={AdminView}>
              <ListItemIcon>
                <WysiwygIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Admin View" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={facultyPage}>
              <ListItemIcon>
                <AssignmentIndIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Faculty View" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 1 }} />

        {/* User Section */}
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleOutlinedIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Profile" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonOutlineIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Faculty" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: '#6439ff' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;