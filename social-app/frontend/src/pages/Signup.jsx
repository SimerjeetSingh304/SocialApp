import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Divider, InputAdornment, IconButton, Box } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForward, Google, GitHub } from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={false}>
      <Box component="form" onSubmit={handleSubmit}>
        {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}
        
        <TextField
          fullWidth
          id="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
        />

        <TextField
          fullWidth
          id="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
        />
        
        <TextField
          fullWidth
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          endIcon={<ArrowForward />}
          sx={{ 
            background: 'linear-gradient(90deg, #d32f2f 0%, #ff7043 100%)', 
            py: 1.5, 
            borderRadius: 24, 
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 10px rgba(211,47,47,0.3)',
            '&:hover': { background: 'linear-gradient(90deg, #c62828 0%, #f4511e 100%)' }
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Divider sx={{ my: 4, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 600 }}>
          OR CONTINUE WITH
        </Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<Google sx={{ color: '#EA4335' }} />} sx={{ borderRadius: 1.5, py: 1, color: 'text.primary', borderColor: '#ddd' }}>
          </Button>
          <Button fullWidth variant="outlined" startIcon={<GitHub sx={{ color: '#000' }} />} sx={{ borderRadius: 1.5, py: 1, color: 'text.primary', borderColor: '#ddd' }}>
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default Signup;
