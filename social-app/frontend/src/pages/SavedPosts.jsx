import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container, Card, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import PostCard from '../components/PostCard';

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts?limit=1000`);
      const allPosts = res.data.posts || [];
      const savedIds = JSON.parse(localStorage.getItem('savedPosts')) || [];
      
      const saved = allPosts.filter(p => savedIds.includes(p._id));
      setPosts(saved);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const handlePostUpdated = (updatedPost) => {
    if (updatedPost._deleted) {
      setPosts(posts.filter(p => p._id !== updatedPost._id));
    } else {
      setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4, flexGrow: 1, maxWidth: '1128px !important' }}>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 540, width: '100%' }}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Saved Posts</Typography>
            </Card>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="text.secondary">You haven't saved any posts yet.</Typography>
              </Box>
            ) : (
              posts.map(post => (
                <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} isSavedView={true} onUnsave={fetchSavedPosts} />
              ))
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

export default SavedPosts;
