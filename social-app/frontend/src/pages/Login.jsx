import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Checkbox, FormControlLabel, Divider, InputAdornment, IconButton, Box } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForward, Google, GitHub } from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={true}>
      <Box component="form" onSubmit={handleSubmit}>
        {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}
        
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
          sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={<Checkbox size="small" color="primary" />}
            label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
          />
          <Typography variant="body2" sx={{ color: '#0066cc', fontWeight: 600, cursor: 'pointer' }}>
            Forgot password?
          </Typography>
        </Box>

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
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

      </Box>
    </AuthLayout>
  );
};

export default Login;
