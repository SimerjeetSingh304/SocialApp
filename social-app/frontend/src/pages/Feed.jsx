import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container, Divider, Typography, Button, Card } from '@mui/material';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Footer from '../components/Footer';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOption, setSortOption] = useState('Top');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts?page=${pageNum}&limit=10`);
      
      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts(prev => [...prev, ...res.data.posts]);
      }
      
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
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
              <Box>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </Box>
            ) : posts.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 48, mb: 1 }}>📝</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No posts yet! Be the first to share something.</Typography>
                <Button variant="contained" sx={{ mt: 2, borderRadius: 24, textTransform: 'none', fontWeight: 600, px: 4 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Create Post
                </Button>
              </Card>
            ) : (
              <>
                {sortedPosts.map(post => (
                  <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
                ))}
                
                {hasMore && (
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => fetchPosts(page + 1)}
                    disabled={loadingMore}
                    sx={{ mt: 2, mb: 4, borderRadius: 24, textTransform: 'none', fontWeight: 600, py: 1 }}
                  >
                    {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
                  </Button>
                )}
              </>
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
