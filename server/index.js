import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Create HTTP server and bind WebSocket server to it
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Optional Express test route
app.get('/', (req, res) => {
  res.send('✅ WebSocket Server is running. Connect via frontend.');
});

// WebSocket events
wss.on('connection', (ws) => {
  console.log('🟢 New WebSocket connection');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'move') {
      // Broadcast movement to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify({ type: 'broadcast', data }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('🔴 WebSocket disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
