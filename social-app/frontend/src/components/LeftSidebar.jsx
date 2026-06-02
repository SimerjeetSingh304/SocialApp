import React, { useContext } from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, CircularProgress } from '@mui/material';
import { Home, PeopleOutlined, BookmarkBorder, BarChartOutlined, Add } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const LeftSidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'My Network', path: '/network', icon: <PeopleOutlined /> },
    { text: 'Saved Posts', path: '/saved', icon: <BookmarkBorder /> },
    { text: 'Analytics', path: '/analytics', icon: <BarChartOutlined /> }
  ];

  const handleCreatePost = () => {
    if (location.pathname !== '/') {
      window.location.href = '/'; // Redirect to feed to create post
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('create-post-input')?.focus();
    }, 400);
  };

  return (
    <Box sx={{ width: 225, flexShrink: 0, position: 'sticky', top: 76 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar 
          src={user?.avatarUrl || ''}
          sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '2rem', border: '2px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', mb: 2 }}
        >
          {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || 'U')}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1, lineHeight: 1.2 }}>{user?.name || 'User'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>{user?.title || user?.email || 'Welcome to ProConnect'}</Typography>
      </Box>

      <List sx={{ px: 0, py: 0, mb: 4 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                sx={{ borderRadius: 2, mb: 0.5, bgcolor: isActive ? '#e0f2fe' : 'transparent', '&:hover': { bgcolor: isActive ? '#e0f2fe' : 'rgba(0,0,0,0.04)' } }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, color: isActive ? 'primary.main' : 'text.secondary', fontSize: '0.9rem' }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleCreatePost}
        startIcon={<Add />}
        sx={{ borderRadius: 24, py: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Create Post
      </Button>
    </Box>
  );
};

export default LeftSidebar;
