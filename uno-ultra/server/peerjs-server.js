const { PeerServer } = require('peer');
const server = PeerServer({ port: 9000, path: '/peerjs', debug: true });
server.on('connection', c => console.log('[peer] connected:', c.getId()));
server.on('disconnect', c => console.log('[peer] disconnected:', c.getId()));
console.log('PeerServer → ws://localhost:9000/peerjs');
