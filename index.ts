import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

export const io = new Server(server);

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
