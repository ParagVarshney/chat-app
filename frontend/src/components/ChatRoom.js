import React, { useEffect, useState } from 'react';
import socket from '../socket';
import axios from 'axios';
import MessageInput from './MessageInput';
import OnlineUsersList from './OnlineUsersList';
import TypingIndicator from './TypingIndicator';

function ChatRoom({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', { username, room });

    axios.get(`${process.env.REACT_APP_API_URL}/messages/${room}`)
      .then(res => setMessages(res.data));

    socket.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing', (name) => {
      setTypingUser(name);
      setTimeout(() => setTypingUser(''), 2000);
    });

    return () => {
      socket.off('chatMessage');
      socket.off('onlineUsers');
      socket.off('typing');
    };
  }, [room, username]);

  return (
    <div>
      <h2>Room: {room}</h2>
      <OnlineUsersList users={onlineUsers} />
      <div style={{ height: 300, overflowY: 'scroll', border: '1px solid gray', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.sender}:</strong> {msg.text}</div>
        ))}
      </div>
      <TypingIndicator typingUser={typingUser} />
      <MessageInput username={username} room={room} />
    </div>
  );
}

export default ChatRoom;

