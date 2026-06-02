import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { Home, PeopleOutlined, BookmarkBorder, BarChartOutlined, Add } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const LeftSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'My Network', path: '/network', icon: <PeopleOutlined /> },
    { text: 'Saved Posts', path: '/saved', icon: <BookmarkBorder /> },
    { text: 'Analytics', path: '/analytics', icon: <BarChartOutlined /> }
  ];

  const handleCreatePost = () => {
    if (location.pathname !== '/') {
      window.location.href = '/'; 
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('create-post-input')?.focus();
    }, 400);
  };

  return (
    <Box sx={{ width: 225, flexShrink: 0, position: 'sticky', top: 76 }}>
      <List sx={{ px: 0, py: 0, mb: 4 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path} sx={{ borderRadius: 2, mb: 0.5, bgcolor: isActive ? '#e0f2fe' : 'transparent', '&:hover': { bgcolor: isActive ? '#e0f2fe' : 'rgba(0,0,0,0.04)' } }}>
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, color: isActive ? 'primary.main' : 'text.secondary', fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Button fullWidth variant="contained" onClick={handleCreatePost} startIcon={<Add />} sx={{ borderRadius: 24, py: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: 'none' }}>
        Create Post
      </Button>
    </Box>
  );
};

export default LeftSidebar;
