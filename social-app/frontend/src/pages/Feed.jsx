import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container, Divider, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Footer from '../components/Footer';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('Top');

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

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === 'Latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      // Both Top and Most Liked sort by likes count descending
      return b.likes.length - a.likes.length;
    }
  });

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
            
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2, mr: 0.5, fontWeight: 500 }}>
                Sort by:
              </Typography>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                style={{ 
                  border: 'none', 
                  backgroundColor: 'transparent', 
                  fontWeight: 600, 
                  color: 'rgba(0, 0, 0, 0.87)', 
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '0.75rem',
                  fontFamily: 'inherit'
                }}
              >
                <option value="Top">Top</option>
                <option value="Latest">Latest</option>
                <option value="Most Liked">Most Liked</option>
              </select>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              sortedPosts.map(post => (
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
