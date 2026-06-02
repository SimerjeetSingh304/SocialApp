import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Box, Drawer, Typography, IconButton, Avatar, List, ListItemButton, TextField } from '@mui/material';
import { Close, EditSquare, Send } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const MessagesDrawer = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let fetchedUsers = res.data.filter(u => u._id !== user?.id);
        
        if (fetchedUsers.length === 0) {
          throw new Error("No users found");
        }
        setUsersList(fetchedUsers);
      } catch (err) {
        console.error('Error fetching users for messages', err);
        // Fallback dummy users
        setUsersList([
          { _id: 'dummy1', name: 'Alex Dev', email: 'alex@example.com' },
          { _id: 'dummy2', name: 'Sarah K', email: 'sarah@example.com' },
          { _id: 'dummy3', name: 'Ravi M', email: 'ravi@example.com' }
        ]);
      }
    };
    if (open && usersList.length === 0) {
      fetchUsers();
    }
  }, [open, user, usersList.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, selectedChat]);

  const handleSendMessage = (e) => {
    if (e.preventDefault) e.preventDefault();
    if (!chatInput.trim() || !selectedChat) return;
    
    const newMsg = { sender: 'me', text: chatInput };
    setChatHistory(prev => ({
      ...prev,
      [selectedChat._id]: [...(prev[selectedChat._id] || []), newMsg]
    }));
    setChatInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 1.5, px: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Messages</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1, color: 'text.secondary' }}>
              <EditSquare fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Body Split */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* Left Panel (120px) */}
          <Box sx={{ width: 120, borderRight: '1px solid #eee', overflowY: 'auto' }}>
            <List disablePadding>
              {usersList.map(u => (
                <ListItemButton 
                  key={u._id} 
                  onClick={() => setSelectedChat(u)}
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    py: 2,
                    px: 1,
                    bgcolor: selectedChat?._id === u._id ? 'rgba(10, 102, 194, 0.08)' : 'transparent',
                    borderLeft: selectedChat?._id === u._id ? '4px solid #0a66c2' : '4px solid transparent'
                  }}
                >
                  <Avatar sx={{ width: 44, height: 44, mb: 1, bgcolor: `hsl(${Math.random() * 360}, 70%, 50%)`, fontSize: '1.2rem' }}>
                    {u.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 600, textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.primary' }}>
                    {u.name.split(' ')[0]}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Right Panel (260px) */}
          <Box sx={{ width: 260, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
            {!selectedChat ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Select a conversation to start messaging</Typography>
              </Box>
            ) : (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 1.5, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                    {selectedChat.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{selectedChat.name}</Typography>
                </Box>

                {/* Chat Area */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
                  {(chatHistory[selectedChat._id] || []).map((msg, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                      <Box sx={{ 
                        bgcolor: msg.sender === 'me' ? '#0a66c2' : '#f0f2f5', 
                        color: msg.sender === 'me' ? 'white' : 'text.primary',
                        px: 1.5, py: 1, borderRadius: 2, maxWidth: '85%',
                        borderBottomRightRadius: msg.sender === 'me' ? 4 : 16,
                        borderBottomLeftRadius: msg.sender === 'me' ? 16 : 4,
                      }}>
                        <Typography variant="body2">{msg.text}</Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box component="form" onSubmit={handleSendMessage} sx={{ p: 1.5, pt: 1, borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', bgcolor: 'white' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 24, bgcolor: '#f0f2f5', '& fieldset': { border: 'none' } }, input: { py: 1, px: 2, fontSize: '0.9rem' } }}
                  />
                  <IconButton type="submit" color="primary" disabled={!chatInput.trim()} sx={{ p: 1 }}>
                    <Send sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MessagesDrawer;
