import React from 'react';
import ProxySetting from './ProxySetting';
import './App.css';
import { Grid, Button, TextField, AppBar, Toolbar, IconButton, Typography, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const versions = window.versions;


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});
function App() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
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
        <ProxySetting></ProxySetting>
        <Drawer open={open} onClose={toggleDrawer(false)}>

        </Drawer>
      </ThemeProvider>
    </div>
  );
}

export default App;
