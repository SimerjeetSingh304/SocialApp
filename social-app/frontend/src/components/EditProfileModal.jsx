import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Avatar, IconButton, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditProfileModal = ({ open, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', title: '' });

  useEffect(() => {
    if (user && open) {
      setFormData({ name: user.name || '', title: user.title || '' });
    }
  }, [user, open]);

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
      if (updateUser) updateUser({ ...user, ...res.data });
      onClose();
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Profile</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, pb: 1 }}>
        
        <Box sx={{ position: 'relative', display: 'inline-flex', alignSelf: 'center', mb: 2, '&:hover .upload-btn': { opacity: 1 } }}>
          <Avatar 
            src={user?.avatarUrl || ''}
            sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
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

        <TextField 
          label="Full Name" 
          fullWidth 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
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
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
        <Button onClick={handleSaveProfile} variant="contained" disabled={saving} sx={{ borderRadius: 24, textTransform: 'none', fontWeight: 600, px: 3 }}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
