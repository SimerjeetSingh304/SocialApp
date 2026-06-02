import React, { useState } from 'react';
import { Box, Card, Typography, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Add, Check } from '@mui/icons-material';

const RightSidebar = () => {
  const [following, setFollowing] = useState({});

  const suggestedUsers = [
    { name: 'David Miller', handle: 'VP of Engineering at CloudSync' },
    { name: 'Emma Watson', handle: 'Senior Content Strategist' }
  ];

  const toggleFollow = (index) => {
    setFollowing(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Box sx={{ width: 300, flexShrink: 0, position: 'sticky', top: 76 }}>
      <Card sx={{ borderRadius: 2, pb: 1 }}>
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Add to your feed</Typography>
        </Box>
        <List disablePadding>
          {suggestedUsers.map((user, index) => (
            <ListItem key={index} sx={{ px: 2, py: 1.5, alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <ListItemAvatar sx={{ minWidth: 56 }}>
                  <Avatar src={`https://i.pravatar.cc/150?u=${user.name}`} sx={{ width: 48, height: 48, bgcolor: `hsl(${Math.random() * 360}, 70%, 50%)` }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user.name}</Typography>}
                  secondary={<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{user.handle}</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>
              <Box sx={{ pl: 7, mt: 1 }}>
                <Button 
                  size="small" 
                  variant={following[index] ? "contained" : "outlined"} 
                  startIcon={following[index] ? <Check /> : <Add />}
                  onClick={() => toggleFollow(index)}
                  sx={{ 
                    borderRadius: 24, 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    color: following[index] ? 'white' : 'text.secondary', 
                    borderColor: following[index] ? 'transparent' : 'text.secondary', 
                    bgcolor: following[index] ? 'text.secondary' : 'transparent',
                    '&:hover': { 
                      bgcolor: following[index] ? 'text.primary' : 'rgba(0,0,0,0.04)', 
                      borderColor: 'text.primary', 
                      color: following[index] ? 'white' : 'text.primary' 
                    } 
                  }}
                >
                  {following[index] ? 'Following' : 'Follow'}
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default RightSidebar;
