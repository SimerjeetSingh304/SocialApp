import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Card, Avatar, Button, Grid, CircularProgress, TextField, InputAdornment } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import { AuthContext } from '../context/AuthContext';
import { Search as SearchIcon, PersonAdd, CheckCircle } from '@mui/icons-material';

const Network = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Exclude current user just in case backend didn't
        const otherUsers = res.data.filter(u => u._id !== currentUser?.id);
        setUsers(otherUsers);

        // Initialize following state from backend isConnected flag
        const initialFollowing = {};
        otherUsers.forEach(u => {
          if (u.isConnected) {
            initialFollowing[u._id] = true;
          }
        });
        setFollowing(initialFollowing);
      } catch (err) {
        console.error('Failed to fetch network users', err);
        // Fallback for visual testing if API fails
        setUsers([
          { _id: '1', name: 'Alex Developer', email: 'alex@example.com' },
          { _id: '2', name: 'Sarah Designer', email: 'sarah@example.com' },
          { _id: '3', name: 'Ravi Manager', email: 'ravi@example.com' }
        ]);
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

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 10, pb: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 800, width: '100%' }}>
            <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Your Network</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {users.length} {users.length === 1 ? 'person' : 'people'} in your network
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Card>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🚀</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>No other users yet.</Typography>
                <Typography color="text.secondary">Invite your friends to start building your network!</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredUsers.map(user => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Card sx={{ 
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center', 
                      height: '100%',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                      <Avatar sx={{ width: 80, height: 80, bgcolor: `hsl(${Math.random() * 360}, 70%, 50%)`, mb: 2, fontSize: '2.5rem' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {user.title || 'ProConnect Member'}
                      </Typography>
                      <Box sx={{ mt: 'auto', width: '100%' }}>
                        <Button 
                          fullWidth
                          variant={following[user._id] ? "contained" : "outlined"}
                          startIcon={following[user._id] ? <CheckCircle /> : <PersonAdd />}
                          onClick={() => toggleFollow(user._id)}
                          sx={{ 
                            borderRadius: 24, 
                            textTransform: 'none', 
                            fontWeight: 600,
                            color: following[user._id] ? 'white' : 'primary.main',
                            borderColor: following[user._id] ? 'transparent' : 'primary.main',
                            bgcolor: following[user._id] ? '#16a34a' : 'transparent', // green filled when connected
                            '&:hover': {
                              bgcolor: following[user._id] ? '#15803d' : 'rgba(10,102,194,0.08)',
                            }
                          }}
                        >
                          {following[user._id] ? 'Connected ✓' : 'Connect'}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <RightSidebar />
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Network;
