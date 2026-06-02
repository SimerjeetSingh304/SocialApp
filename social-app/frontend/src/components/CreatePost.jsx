import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, TextField, Button, Box, Typography, Avatar, Divider, Collapse } from '@mui/material';
import { InsertPhotoOutlined, EventNoteOutlined, ArticleOutlined } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl.trim()) {
      setError('Text or Image URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts`, 
        { text, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostCreated(res.data);
      setText('');
      setImageUrl('');
      setIsExpanded(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      document.getElementById('create-post-input')?.focus();
    }, 100);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ pb: '8px !important', pt: 2, px: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Typography color="error" variant="body2" mb={1}>{error}</Typography>}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar src={user?.avatarUrl || ''} sx={{ width: 48, height: 48, bgcolor: '#1a1a1a', mr: 2, fontSize: '1.25rem' }}>
                {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || 'U')}
              </Avatar>
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  border: '1px solid #b0b8c1', 
                  borderRadius: 24, 
                  px: 2, 
                  py: 1.5, 
                  cursor: 'text',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
                onClick={handleExpand}
              >
                {!isExpanded ? (
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Start a post...</Typography>
                ) : (
                  <TextField
                    id="create-post-input"
                    fullWidth
                    multiline
                    autoFocus
                    minRows={2}
                    placeholder="What do you want to talk about?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                )}
              </Box>
            </Box>
            
            <Collapse in={isExpanded}>
              <Box sx={{ mt: 2, mb: 1, pl: 8 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Image URL (optional)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Box>
            </Collapse>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<InsertPhotoOutlined sx={{ color: '#0a66c2' }} />} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, py: 1, px: 2, borderRadius: 2 }}>
                  Media
                </Button>
                <Button startIcon={<EventNoteOutlined sx={{ color: '#c37d16' }} />} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, py: 1, px: 2, borderRadius: 2 }}>
                  Event
                </Button>
                <Button startIcon={<ArticleOutlined sx={{ color: '#e16745' }} />} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, py: 1, px: 2, borderRadius: 2 }}>
                  Article
                </Button>
              </Box>
              
              {isExpanded && (
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading || (!text.trim() && !imageUrl.trim())}
                  sx={{ borderRadius: 24, px: 3 }}
                >
                  Post
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mx: 1, fontWeight: 500 }}>
          Sort by: <Box component="span" sx={{ color: 'text.primary', fontWeight: 600, cursor: 'pointer' }}>Top</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default CreatePost;
