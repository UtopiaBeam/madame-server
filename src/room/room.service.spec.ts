import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game/game.service';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: GameService,
          useValue: {
            createRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    gameService = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call gameService', () => {
    const id = 'test-player';
    const name = 'john doe';
    const avatar = '/path/to/avatar';

    jest.spyOn(gameService, 'createRoom');

    const roomId = service.createRoom({ id, name, avatar });

    expect(gameService.createRoom).toBeCalledTimes(1);
    expect(gameService.createRoom).toBeCalledWith(roomId, {
      id,
      name,
      avatar,
    });
  });
});
