// frontend/src/components/Layout/Layout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Tasks',     to: '/' },
    { label: 'Workflows', to: '/workflows' },
    { label: 'Profile',   to: '/profile' }
  ];

  // Drawer contents
  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={handleDrawerToggle}>
      <Toolbar />
      <List>
        {navItems.map(({ label, to }) => (
          <ListItem button key={to} component={Link} to={to}>
            <ListItemText primary={label} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Hamburger only, no permanent drawer */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task & Workflow Manager
          </Typography>

          {/* Optional top-right logout */}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
        }}
      >
        {/* Spacer to push content below AppBar */}
        <Toolbar />
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
