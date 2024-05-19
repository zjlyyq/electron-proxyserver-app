import React, { useState } from 'react';
import ProxySetting from './ProxySetting';
import './App.css';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Typography, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import RouterIcon from '@mui/icons-material/Router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const versions = window.versions;

const nameMap = {
  'ProxySetting': '代理设置',
  'preview': '预览器'
}
const routeMap = {
  'ProxySetting': ProxySetting,
  'preview': () => <div>preview</div>
}
const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});
function App() {
  const [open, setOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  let currentPage = document.location.hash.replace(/#\/?/, "");
  let CurrentPage = routeMap[currentPage] || (() => <div>hello</div>);
  const handleLinkClick = (key) => {
    // window.location.hash = `#${key}`;
    window.history.pushState(null, "", `/#/${key}`);
    // setRefresh((prev) => prev + 1);
  };
  
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {Object.keys(routeMap).map((path, index) => (
          <ListItem key={index} disablePadding onClick={() => handleLinkClick(path)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <TuneIcon /> : <RouterIcon />}
              </ListItemIcon>
              <ListItemText primary={nameMap[path]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <div className="App">
      <ThemeProvider  theme={darkTheme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Proxy Master
            </Typography>
          </Toolbar>
        </AppBar>
        <CurrentPage />
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </ThemeProvider>
    </div>
  );
}

export default App;
