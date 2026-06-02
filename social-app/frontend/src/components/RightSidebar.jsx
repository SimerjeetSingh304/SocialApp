import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Card, Typography, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from '@mui/material';
import { Add, Check } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const RightSidebar = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Exclude current user and take up to 3 non-connected users
        const suggestions = res.data.filter(u => u._id !== currentUser?.id && !u.isConnected).slice(0, 3);
        setUsers(suggestions);
        
      } catch (err) {
        console.error('Failed to fetch suggested users', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const toggleFollow = async (id) => {
    // Optimistic UI update
    setFollowing(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users/connect/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to toggle connection', err);
      // Revert on failure
      setFollowing(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  return (
    <Box sx={{ width: 300, flexShrink: 0, position: 'sticky', top: 76 }}>
      <Card sx={{ borderRadius: 2, pb: 1 }}>
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Add to your network</Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
             <CircularProgress size={24} />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 2 }}>
             <Typography variant="body2" color="text.secondary">No new suggestions at this time.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {users.map((user) => {
              const isFollowing = following[user._id];
              return (
                <ListItem key={user._id} sx={{ px: 2, py: 1.5, alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <ListItemAvatar sx={{ minWidth: 56 }}>
                      <Avatar src={user.avatarUrl} sx={{ width: 48, height: 48, bgcolor: `hsl(${Math.random() * 360}, 70%, 50%)` }}>
                        {!user.avatarUrl && user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user.name}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{user.title || 'Software Engineer'}</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Box>
                  <Box sx={{ pl: 7, mt: 1 }}>
                    <Button 
                      size="small" 
                      variant={isFollowing ? "contained" : "outlined"} 
                      startIcon={isFollowing ? <Check /> : <Add />}
                      onClick={() => toggleFollow(user._id)}
                      sx={{ 
                        borderRadius: 24, 
                        textTransform: 'none', 
                        fontWeight: 600, 
                        color: isFollowing ? 'white' : 'text.secondary', 
                        borderColor: isFollowing ? 'transparent' : 'text.secondary', 
                        bgcolor: isFollowing ? 'text.secondary' : 'transparent',
                        '&:hover': { 
                          bgcolor: isFollowing ? 'text.primary' : 'rgba(0,0,0,0.04)', 
                          borderColor: 'text.primary', 
                          color: isFollowing ? 'white' : 'text.primary' 
                        } 
                      }}
                    >
                      {isFollowing ? 'Connected' : 'Connect'}
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </Card>
    </Box>
  );
};

export default RightSidebar;
