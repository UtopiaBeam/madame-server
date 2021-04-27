import { io } from '.';
import { GameStore } from './stores/GameStore';

io.on('connection', client => {
  client.on('join-game', gameId => {
    client.join(gameId);
    const game = GameStore.findOne(gameId);
    const players = game.players.map(p => p.info);
    io.to(gameId).emit('new-player', players);
  });
});
