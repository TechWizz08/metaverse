import React, { useEffect, useState } from 'react';
import connectWebSocket from './socket';
import './index.css';

let socket;

function App() {
  const [avatars, setAvatars] = useState([]);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [id, setId] = useState(null);

  useEffect(() => {
    const userId = Math.random().toString(36).substr(2, 9);
    setId(userId);

    connectWebSocket().then((ws) => {
      socket = ws;

      socket.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'broadcast') {
          const { id: otherId, position: otherPos } = msg.data;

          setAvatars(prev => {
            const exists = prev.find(a => a.id === otherId);
            if (exists) {
              return prev.map(a => a.id === otherId ? { ...a, position: otherPos } : a);
            } else {
              return [...prev, { id: otherId, position: otherPos }];
            }
          });
        }
      });

      // Send initial position once socket is ready
      sendPosition(position);
    });

    const handleKeyDown = (e) => {
      setPosition(prev => {
        const updated = { ...prev };

        if (e.key === 'ArrowUp') updated.y -= 10;
        if (e.key === 'ArrowDown') updated.y += 10;
        if (e.key === 'ArrowLeft') updated.x -= 10;
        if (e.key === 'ArrowRight') updated.x += 10;

        sendPosition(updated);
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (socket && socket.readyState === 1) socket.close();
    };
  }, []);

  const sendPosition = (pos) => {
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify({
        type: 'move',
        id,
        position: pos
      }));
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#f4f4f4' }}>
      {/* You */}
      <div style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 30,
        height: 30,
        backgroundColor: 'blue',
        borderRadius: '50%',
        border: '2px solid black'
      }} title="You" />

      {/* Others */}
      {avatars.map(avatar => (
        <div key={avatar.id}
          style={{
            position: 'absolute',
            left: avatar.position.x,
            top: avatar.position.y,
            width: 30,
            height: 30,
            backgroundColor: 'green',
            borderRadius: '50%',
            border: '2px solid black'
          }}
          title={avatar.id}
        />
      ))}
     


    </div>
  );
}

export default App;
