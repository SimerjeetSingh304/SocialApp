import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Footer from '../components/Footer';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts`);
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

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
          
          {/* Left Sidebar (Hidden on mobile) */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Box>

          {/* Main Feed Content */}
          <Box sx={{ flexGrow: 1, maxWidth: 540, width: '100%' }}>
            <CreatePost onPostCreated={handlePostCreated} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              posts.map(post => (
                <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
              ))
            )}
          </Box>

          {/* Right Sidebar (Hidden on tablets and below) */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <RightSidebar />
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
