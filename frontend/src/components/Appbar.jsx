import { useNavigate } from "react-router-dom";
import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Appbar = () => {
  const nav = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    nav("/");
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: `240px` },
          }}
          style={{
            backgroundColor: "#6439ff",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              CURRICULUM DASHBOARD
            </Typography>
            <Button color="inherit" variant="outlined" onClick={logout}>
              LogOut
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Appbar;
