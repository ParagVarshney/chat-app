import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';


function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (username && room) setJoined(true); 
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <h2>Join Chat Room</h2>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Room" value={room} onChange={e => setRoom(e.target.value)} />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <ChatRoom username={username} room={room} />
      )}
    </div>
  );
}

export default App;
