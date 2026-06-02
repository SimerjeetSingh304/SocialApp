import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ py: 3, textAlign: 'center', mt: 'auto' }}>
      <Typography variant="body2" color="text.secondary">
        © 2026 SocialApp. Built with React + Node.js + MongoDB.
      </Typography>
    </Box>
  );
};

export default Footer;
