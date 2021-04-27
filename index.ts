import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import router from './routes';
import * as cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
const server = http.createServer(app);

export const io = new Server(server);

server.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));
