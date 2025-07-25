import React, { useState } from 'react';
import socket from '../socket';

function MessageInput({ username, room }) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', { sender: username, text: message, room });
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { room, username });
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleTyping}
        placeholder="Type your message"
        style={{ width: '70%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessageInput;

