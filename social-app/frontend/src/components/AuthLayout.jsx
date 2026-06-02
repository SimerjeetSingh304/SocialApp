import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { CheckCircleOutlined } from '@mui/icons-material';

const AuthLayout = ({ children, isLogin }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      
      {/* Left Column (40%) */}
      <Box sx={{ 
        width: { xs: '100%', md: '40%' },
        background: 'linear-gradient(135deg, #0a66c2 0%, #280a33 50%, #701020 100%)',
        color: 'white',
        p: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box sx={{ maxWidth: 440, mx: 'auto', width: '100%' }}>
          <Box sx={{ 
            border: '1px solid rgba(255,255,255,0.4)', 
            borderRadius: 24, 
            px: 2, py: 0.5, 
            display: 'inline-flex', 
            alignItems: 'center', 
            mb: 4 
          }}>
            <CheckCircleOutlined sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>ProConnect</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.15 }}>
            Power your<br/>productivity.
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffccb3', lineHeight: 1.6, fontSize: '1.05rem' }}>
            Join the community. Connect with developers, share your work, and grow your network.
          </Typography>
        </Box>
      </Box>
      
      {/* Right Column (60%) */}
      <Box sx={{ 
        width: { xs: '100%', md: '60%' }, 
        bgcolor: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 4 
      }}>
        <Box sx={{ maxWidth: 460, width: '100%' }}>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #eaeaea', mb: 4 }}>
            <Box component={RouterLink} to="/login" sx={{ 
              flex: 1, textAlign: 'center', py: 2, textDecoration: 'none', fontWeight: 600,
              color: isLogin ? '#d32f2f' : 'text.secondary',
              borderBottom: isLogin ? '2px solid #d32f2f' : '2px solid transparent'
            }}>
              Log In
            </Box>
            <Box component={RouterLink} to="/signup" sx={{ 
              flex: 1, textAlign: 'center', py: 2, textDecoration: 'none', fontWeight: 600,
              color: !isLogin ? '#d32f2f' : 'text.secondary',
              borderBottom: !isLogin ? '2px solid #d32f2f' : '2px solid transparent'
            }}>
              Sign Up
            </Box>
          </Box>
          
          {children}

        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
