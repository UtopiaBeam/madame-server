import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { RoomModule } from '../src/room/room.module';

describe('RoomGateway (e2e)', () => {
  let app: INestApplication;
  let client: SocketIOClient.Socket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await app.listen(3000);
  });

  beforeEach(() => {
    client = io('http://localhost:3000');
  });

  afterEach(() => {
    client.close();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should successfully connect', done => {
    client.on('connect', () => {
      done();
    });
  });

  it('should create a room', done => {
    const name = 'john doe';
    const avatar = '/path/to/avatar';

    client.on('connect', () => {
      client.emit('room:create', { name, avatar }, (room: string) => {
        expect(room).toBeDefined();
        expect(room.length).toBe(5);
        done();
      });
    });
  });
});
