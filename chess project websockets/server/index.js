const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { gameLogic } = require('./gameLogic');
const { handleWebSocketConnection } = require('./websocket');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

wss.on('connection', (ws) => {
    handleWebSocketConnection(ws);
});

// The "catchall" handler: for any request that doesn't match the above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

server.listen(process.env.PORT || 8080, () => {
    console.log('Server is listening on port', process.env.PORT || 8080);
});
