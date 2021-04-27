import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import router from './routes';
import * as cors from 'cors';
import { GameStore } from './stores/GameStore';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', client => {
  client.on('join-game', gameId => {
    client.join(gameId);
    const game = GameStore.findOne(gameId);
    const players = game.players.map(p => p.info);
    io.to(gameId).emit('new-player', players);
  });
});

server.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));
