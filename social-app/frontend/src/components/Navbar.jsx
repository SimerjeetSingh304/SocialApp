import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, InputBase, Box, Avatar, IconButton, Badge, Tab, Tabs, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, NotificationsOutlined, ChatOutlined } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import MessagesDrawer from './MessagesDrawer';
import EditProfileModal from './EditProfileModal';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts`),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users`)
        ]);

        const allPosts = postsRes.data;
        const allUsers = usersRes.data;

        const getUserName = (id) => allUsers.find(u => u._id === id)?.name || 'Someone';

        const myPosts = allPosts.filter(p => p.userId === user?.id);
        let notifs = [];

        myPosts.forEach(post => {
          post.comments.forEach(comment => {
            if (comment.username !== user?.name) {
              notifs.push({ 
                id: Math.random(), 
                username: comment.username, 
                text: 'commented on your post', 
                date: new Date(comment.createdAt) 
              });
            }
          });
          
          post.likes.forEach(likeId => {
            if (likeId !== user?.id) {
              notifs.push({ 
                id: Math.random(), 
                username: getUserName(likeId), 
                text: 'liked your post', 
                date: new Date(post.createdAt) // Approximation for like date
              });
            }
          });
        });

        notifs.sort((a, b) => b.date - a.date);
        setNotifications(notifs.slice(0, 5));

      } catch (err) {
        console.error('Error fetching navbar data', err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleNotifClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotifClose = () => setAnchorEl(null);

  const getTabValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/network') return 1;
    return 0; // default Feed
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,0.08)', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: '52px !important', maxWidth: 1128, width: '100%', mx: 'auto', px: { xs: 2, md: 0 }, display: 'flex', justifyContent: 'space-between' }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', color: 'primary.main', mr: 2, fontSize: '1.25rem', textDecoration: 'none' }}>
              ProConnect
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: '#edf3f8', px: 2, py: 0.5, borderRadius: 1, width: 280 }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase placeholder="Search..." sx={{ width: '100%', fontSize: '0.9rem' }} />
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, height: '100%' }}>
            <Tabs value={getTabValue()} textColor="primary" indicatorColor="primary" sx={{ '& .MuiTab-root': { minWidth: 80, textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' } }}>
              <Tab label="Feed" component={Link} to="/" />
              <Tab label="Network" component={Link} to="/network" />
              <Tab label="Messages" onClick={() => setMessagesOpen(true)} />
            </Tabs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleNotifClick}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsOutlined />
              </Badge>
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => setMessagesOpen(true)}>
              <ChatOutlined />
            </IconButton>
            <Avatar 
              sx={{ width: 32, height: 32, bgcolor: 'primary.main', ml: 1, fontSize: '1rem', cursor: 'pointer' }}
              src={user?.avatarUrl || ''}
              onClick={() => setEditProfileOpen(true)}
            >
              {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || 'U')}
            </Avatar>
          </Box>

        </Toolbar>
      </AppBar>

      {/* Notifications Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotifClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
        </Box>
        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map(notif => (
            <MenuItem key={notif.id} sx={{ whiteSpace: 'normal', py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                {notif.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2">
                  <strong>{notif.username}</strong> {notif.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(notif.date)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <MessagesDrawer open={messagesOpen} onClose={() => setMessagesOpen(false)} />
      <EditProfileModal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
    </>
  );
};

export default Navbar;
