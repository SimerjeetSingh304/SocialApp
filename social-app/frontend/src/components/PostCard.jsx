import React, { useState, useContext, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, Box, Button, Divider, IconButton, InputBase, Snackbar, Menu, MenuItem } from '@mui/material';
import { MoreHoriz, Favorite, FavoriteBorder, ChatOutlined, Repeat, SendOutlined, SentimentSatisfiedAltOutlined, Public, BookmarkBorder, Bookmark } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const PostCard = ({ post, onPostUpdated, isSavedView, onUnsave }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Link copied!');
  const [isSaved, setIsSaved] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const isLiked = post.likes.includes(user?.id);
  const avatarColor = useMemo(() => stringToColor(post.username), [post.username]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    setIsSaved(savedPosts.includes(post._id));
  }, [post._id]);

  const toggleSave = () => {
    let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    if (isSaved) {
      savedPosts = savedPosts.filter(id => id !== post._id);
      setIsSaved(false);
      if (isSavedView && onUnsave) onUnsave();
    } else {
      savedPosts.push(post._id);
      setIsSaved(true);
    }
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  };

  const handleLike = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts/${post._id}/like`);
      onPostUpdated({ ...post, likes: res.data });
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts/${post._id}/comment`, { text: commentText });
      onPostUpdated({ ...post, comments: res.data });
      setCommentText('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
    setSnackbarMessage('Link copied!');
    setSnackbarOpen(true);
  };
  
  const handleRepost = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts`, {
        text: `♻️ Reposted from ${post.username}\n\n${post.text || ''}`,
        imageUrl: post.imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbarMessage('Post reposted successfully!');
      setSnackbarOpen(true);
      setTimeout(() => window.location.reload(), 1000); // Reload to show the new post in feed
    } catch (err) {
      console.error('Repost failed', err);
    }
  };
  
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    handleMenuClose();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts/${post._id}`);
      onPostUpdated({ ...post, _deleted: true });
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const formatTimestamp = (dateString) => {
    const hours = Math.abs(new Date() - new Date(dateString)) / 36e5;
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  // Safe extraction of populated user ID
  const authorId = typeof post.userId === 'object' ? post.userId?._id : post.userId;
  const authorAvatar = typeof post.userId === 'object' ? post.userId?.avatarUrl : '';
  const isMyPost = authorId === user?.id || post.username === user?.name;
  const authorTitle = typeof post.userId === 'object' ? post.userId?.title : (isMyPost ? user?.title : '');

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardHeader
          avatar={
            <Avatar src={authorAvatar} sx={{ bgcolor: avatarColor, width: 48, height: 48 }}>
              {!authorAvatar && post.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <Box sx={{ mt: -0.5 }}>
              <IconButton aria-label="save" onClick={toggleSave}>
                {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreHoriz />
              </IconButton>
            </Box>
          }
          title={<Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'text.primary' }}>{post.username}</Typography>}
          subheader={
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {authorTitle && <Typography variant="caption" color="text.secondary" sx={{ mt: -0.2 }}>{authorTitle}</Typography>}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.2 }}>
                <Typography variant="caption" color="text.secondary">{formatTimestamp(post.createdAt)} •</Typography>
                <Public sx={{ fontSize: 14, color: 'text.secondary', ml: 0.5 }} />
              </Box>
            </Box>
          }
          sx={{ pb: 1, pt: 2, px: 2 }}
        />
        
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {isMyPost ? (
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main', fontWeight: 600 }}>Delete Post</MenuItem>
          ) : (
            <MenuItem onClick={handleMenuClose}>Report</MenuItem>
          )}
        </Menu>
        
        {post.text && (
          <CardContent sx={{ pt: 0, pb: 1, px: 2 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'text.primary' }}>
              {post.text}
            </Typography>
          </CardContent>
        )}
        
        {post.imageUrl && (
          <Box sx={{ width: '100%' }}>
            <img src={post.imageUrl} alt="Post content" style={{ width: '100%', display: 'block', maxHeight: 500, objectFit: 'cover' }} />
          </Box>
        )}
        
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {post.likes.length > 0 && (
              <>
                <Box sx={{ bgcolor: '#e11d48', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 0.5 }}>
                  <Favorite sx={{ fontSize: 10, color: 'white' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {post.likes.length}
                </Typography>
              </>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {post.comments.length} comments • 0 reposts
          </Typography>
        </Box>

        <Divider sx={{ mx: 2 }} />

        <CardActions sx={{ px: 2, py: 0.5, justifyContent: 'space-between' }}>
          <Button 
            startIcon={isLiked ? <Favorite sx={{ color: '#e11d48' }} /> : <FavoriteBorder />} 
            onClick={handleLike} 
            sx={{ textTransform: 'none', color: isLiked ? '#e11d48' : 'text.secondary', fontWeight: 600, flex: 1, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            {isLiked ? 'Unlike' : 'Like'}
          </Button>
          <Button 
            startIcon={<ChatOutlined />} 
            onClick={() => setShowComments(!showComments)}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, flex: 1, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            Comment
          </Button>
          <Button 
            startIcon={<Repeat />} 
            onClick={handleRepost}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, flex: 1, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            Repost
          </Button>
          <Button 
            startIcon={<SendOutlined sx={{ transform: 'rotate(-45deg)', mt: -0.5 }} />} 
            onClick={handleShare}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, flex: 1, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
          >
            Share
          </Button>
        </CardActions>
        
        {showComments && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', mt: 1, alignItems: 'center' }}>
              <Avatar src={user?.avatarUrl || ''} sx={{ width: 40, height: 40, mr: 1, bgcolor: 'primary.main' }}>
                {!user?.avatarUrl && user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1, border: '1px solid #b0b8c1', borderRadius: 24, px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                <InputBase
                  fullWidth
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  sx={{ fontSize: '0.9rem' }}
                />
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <SentimentSatisfiedAltOutlined />
                </IconButton>
              </Box>
              {commentText.trim() && (
                <Button type="submit" color="primary" sx={{ ml: 1, minWidth: 0, fontWeight: 600 }}>
                  Post
                </Button>
              )}
            </Box>

            {post.comments.length > 0 && <Box sx={{ mt: 3 }} />}
            
            {post.comments.map((comment, index) => {
              const commentAvatarUrl = comment.userId?.avatarUrl || '';
              return (
                <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar src={commentAvatarUrl} sx={{ width: 40, height: 40, mr: 1, bgcolor: stringToColor(comment.username) }}>
                    {!commentAvatarUrl && comment.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ bgcolor: '#f2f2f2', px: 2, py: 1, borderRadius: '0 8px 8px 8px', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" component="div" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" component="div" sx={{ fontSize: '0.85rem', mt: 0.5 }}>
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Card>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default PostCard;
