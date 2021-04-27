import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import router from './routes';

const app = express();
app.use(express.json());
app.use(router);
const server = http.createServer(app);

export const io = new Server(server);

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
