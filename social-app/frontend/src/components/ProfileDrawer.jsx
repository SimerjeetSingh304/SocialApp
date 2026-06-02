import React, { useContext, useState, useRef, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Avatar, TextField, Button, CircularProgress } from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProfileDrawer = ({ open, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    dob: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        dob: user.dob ? user.dob.split('T')[0] : ''
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users/profile`, formData);
      updateUser({ ...user, ...res.data });
      onClose();
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
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

  return (
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { width: 350, p: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Edit Profile</Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar 
            src={user?.avatarUrl || ''}
            sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            {!user?.avatarUrl && (user?.name?.charAt(0).toUpperCase() || 'U')}
          </Avatar>
          
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/gif" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          <IconButton 
            size="small" 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            sx={{ 
              position: 'absolute', bottom: 0, right: 0, 
              bgcolor: 'white', border: '1px solid #ccc',
              '&:hover': { bgcolor: '#f0f0f0' }
            }}
          >
            {uploading ? <CircularProgress size={16} /> : <PhotoCamera sx={{ fontSize: 16, color: 'text.secondary' }} />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField 
          label="Full Name" 
          name="name"
          fullWidth 
          value={formData.name} 
          onChange={handleChange} 
        />
        <TextField 
          label="Role / Title" 
          name="title"
          placeholder="e.g. Software Engineer"
          fullWidth 
          value={formData.title} 
          onChange={handleChange} 
        />
        <TextField 
          label="Date of Birth" 
          name="dob"
          type="date"
          fullWidth 
          InputLabelProps={{ shrink: true }}
          value={formData.dob} 
          onChange={handleChange} 
        />
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2, py: 1.5, borderRadius: 24, fontWeight: 'bold' }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
