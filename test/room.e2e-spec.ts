import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { RoomModule } from '../src/room/room.module';
import { PlayerState } from '../src/util/player-state';

describe('RoomGateway (e2e)', () => {
  let app: INestApplication;
  let client: SocketIOClient.Socket;

  const name = 'test-client';
  const avatar = '/path/to/avatar';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RoomModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await app.listen(3000);
  });

  beforeEach(() => {
    client = io('http://localhost:3000', { autoConnect: false });
  });

  afterEach(() => {
    client.close();
  });

  afterAll(() => {
    app.close();
  });

  it('should successfully connect', done => {
    client.on('connect', () => {
      done();
    });
    client.connect();
  });

  describe('createRoom', () => {
    it('should create a room', done => {
      client.on('connect', () => {
        client.emit('room:create', { name, avatar }, (room: string) => {
          expect(room).toBeDefined();
          expect(room.length).toBe(5);
          done();
        });
      });
      client.connect();
    });
  });

  describe('joinRoom', () => {
    let ownerClient: SocketIOClient.Socket;
    let roomId: string;

    const ownerName = 'test-owner';
    const ownerAvatar = '/path/to/owner-avatar';

    beforeAll(() => {
      ownerClient = io('http://localhost:3000');
      ownerClient.on('connect', () => {
        ownerClient.emit(
          'room:create',
          { name: ownerName, avatar: ownerAvatar },
          (room: string) => {
            roomId = room;
            client.connect();
          },
        );
      });
    });

    afterAll(() => {
      ownerClient.close();
    });

    it('should get players after join', done => {
      client.on('connect', () => {
        client.emit(
          'room:join',
          { roomId, name, avatar },
          (players: PlayerState[]) => {
            expect(players).toHaveLength(2);
            done();
          },
        );
      });
    });
  });
});
