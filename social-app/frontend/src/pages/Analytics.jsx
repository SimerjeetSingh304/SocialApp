import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container, Card, Typography, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import { AuthContext } from '../context/AuthContext';
import { Article, ThumbUp, Comment } from '@mui/icons-material';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts`);
        const allPosts = res.data;
        
        // Filter posts owned by current user
        const myPosts = allPosts.filter(p => {
          const authorId = typeof p.userId === 'object' ? p.userId?._id : p.userId;
          return authorId === user?.id || p.username === user?.name;
        });
        
        let totalLikes = 0;
        let totalComments = 0;
        
        myPosts.forEach(post => {
          totalLikes += post.likes.length;
          totalComments += post.comments.length;
        });
        
        setStats({
          totalPosts: myPosts.length,
          totalLikes,
          totalComments
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4, flexGrow: 1, maxWidth: '1128px !important' }}>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 540, width: '100%' }}>
            <Card sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Analytics Overview</Typography>
            </Card>

            {loading || !stats ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(10, 102, 194, 0.1)', p: 2, borderRadius: 2, mr: 3 }}>
                      <Article sx={{ color: 'primary.main', fontSize: 40 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.totalPosts}</Typography>
                      <Typography variant="body1" color="text.secondary">Total Posts Created</Typography>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(225, 29, 72, 0.1)', p: 2, borderRadius: 2, mr: 3 }}>
                      <ThumbUp sx={{ color: '#e11d48', fontSize: 40 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.totalLikes}</Typography>
                      <Typography variant="body1" color="text.secondary">Total Likes Received</Typography>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(234, 179, 8, 0.1)', p: 2, borderRadius: 2, mr: 3 }}>
                      <Comment sx={{ color: '#eab308', fontSize: 40 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.totalComments}</Typography>
                      <Typography variant="body1" color="text.secondary">Total Comments Received</Typography>
                    </Box>
                  </Card>
                </Grid>
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

export default Analytics;
