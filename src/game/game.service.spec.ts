import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoom', () => {
    const roomId = '00000';
    const id = 'test-player';
    const name = 'test';
    const avatar = '/path/to/avatar';

    it('should have 1 player', () => {
      jest.spyOn(service, 'createGameState');
      service.createGameState(roomId, { id, name, avatar });

      expect(service.createGameState).toBeCalledTimes(1);
      expect(service.getGameState(roomId)).toBeDefined();
    });
  });
});
