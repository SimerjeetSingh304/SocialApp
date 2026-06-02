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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/posts/upload`, 
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setImageUrl(res.data.imageUrl);
      setIsExpanded(true);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset input so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

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
          <Box 
            component="form" 
            onSubmit={handleSubmit}
          >
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
              <Box sx={{ mt: 2, mb: 1, pl: { xs: 0, sm: 8 } }}>
                {!imageUrl ? (
                  <Box 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: `2px dashed ${isDragging ? '#0a66c2' : '#ccc'}`,
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      bgcolor: isDragging ? 'rgba(10, 102, 194, 0.05)' : '#fafafa',
                      transition: 'all 0.2s ease',
                      mb: 2,
                      '&:hover': {
                        bgcolor: 'rgba(10, 102, 194, 0.05)',
                        borderColor: '#0a66c2'
                      }
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      {uploadingImage ? 'Uploading...' : '📁 Drag & drop image here or click to upload'}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={imageUrl} alt="Upload preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block', backgroundColor: '#f9f9f9' }} />
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="error" 
                      onClick={() => setImageUrl('')}
                      sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, width: 32, height: 32, borderRadius: '50%', p: 0 }}
                    >
                      ×
                    </Button>
                  </Box>
                )}
                
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
                <Button 
                  startIcon={<InsertPhotoOutlined sx={{ color: '#0a66c2' }} />} 
                  sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, py: 1, px: 2, borderRadius: 2 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Media'}
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />
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


    </Box>
  );
};

export default CreatePost;
