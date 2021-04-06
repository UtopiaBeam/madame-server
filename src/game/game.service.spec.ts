import { Test, TestingModule } from '@nestjs/testing';
import { StateRepository } from '../game/state.repo';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let repo: StateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, StateRepository],
    }).compile();

    service = module.get<GameService>(GameService);
    repo = module.get<StateRepository>(StateRepository);
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
      jest.spyOn(repo, 'createGameState');
      service.createRoom(roomId, { id, name, avatar });

      expect(repo.createGameState).toBeCalledTimes(1);
      expect(repo.getGameState(roomId)).toBeDefined();
    });
  });
});
