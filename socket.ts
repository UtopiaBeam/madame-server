import { io } from '.';

io.on('connection', client => {
  client.on('join-game', gameId => {
    client.join(gameId);
  });
});
