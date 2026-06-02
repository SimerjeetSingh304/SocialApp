import React, { useContext, useRef, useState } from 'react';
import { Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, CircularProgress, Card, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Home, PeopleOutlined, BookmarkBorder, BarChartOutlined, Add, PhotoCamera, EditOutlined } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const LeftSidebar = () => {
  const { user, updateUser } = useContext(AuthContext);
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', title: user?.title || '' });

  const menuItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'My Network', path: '/network', icon: <PeopleOutlined /> },
    { text: 'Saved Posts', path: '/saved', icon: <BookmarkBorder /> },
    { text: 'Analytics', path: '/analytics', icon: <BarChartOutlined /> }
  ];

  const handleCreatePost = () => {
    if (location.pathname !== '/') {
      window.location.href = '/'; 
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('create-post-input')?.focus();
    }, 400);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append('avatar', file);

    try {
      setUploading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (updateUser) updateUser(res.data.user);
    } catch (err) {
      console.error('Avatar upload failed', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users/profile`, formData);
      updateUser({ ...user, ...res.data });
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: 225, flexShrink: 0, position: 'sticky', top: 76 }}>
      
      <Card sx={{ borderRadius: 2, mb: 3, p: 2, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, '&:hover .upload-btn': { opacity: 1 } }}>
          <Avatar 
            src={user?.avatarUrl || ''}
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', mx: 'auto' }}
          >
            {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || 'U')}
          </Avatar>
          
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
          
          <IconButton 
            className="upload-btn"
            size="small" 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            sx={{ 
              position: 'absolute', bottom: 0, right: 0, 
              bgcolor: 'white', border: '1px solid #ddd',
              opacity: uploading ? 1 : 0, transition: 'opacity 0.2s',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            {uploading ? <CircularProgress size={16} /> : <PhotoCamera sx={{ fontSize: 16, color: 'text.secondary' }} />}
          </IconButton>
        </Box>
        
        <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user?.name || 'User'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{user?.title || user?.email || 'Welcome to ProConnect'}</Typography>
        
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth 
          startIcon={<EditOutlined />} 
          onClick={() => {
            setFormData({ name: user?.name || '', title: user?.title || '' });
            setEditOpen(true);
          }}
          sx={{ borderRadius: 24, textTransform: 'none', fontWeight: 600 }}
        >
          Edit Profile
        </Button>
      </Card>

      <List sx={{ px: 0, py: 0, mb: 4 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path} sx={{ borderRadius: 2, mb: 0.5, bgcolor: isActive ? '#e0f2fe' : 'transparent', '&:hover': { bgcolor: isActive ? '#e0f2fe' : 'rgba(0,0,0,0.04)' } }}>
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, color: isActive ? 'primary.main' : 'text.secondary', fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Button fullWidth variant="contained" onClick={handleCreatePost} startIcon={<Add />} sx={{ borderRadius: 24, py: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', boxShadow: 'none' }}>
        Create Post
      </Button>

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField 
            label="Full Name" 
            fullWidth 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            sx={{ mt: 1 }}
          />
          <TextField 
            label="Role / Title" 
            placeholder="e.g. Software Engineer"
            fullWidth 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" disabled={saving} sx={{ borderRadius: 24, textTransform: 'none', fontWeight: 600, px: 3 }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeftSidebar;
