import { Test, TestingModule } from '@nestjs/testing';
import { StateRepository } from './state.repo';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;
  let repo: StateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateService, StateRepository],
    }).compile();

    service = module.get<StateService>(StateService);
    repo = module.get<StateRepository>(StateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoom', () => {
    const roomId = '00000';
    const name = 'test';
    const avatar = '/path/to/avatar';

    it('should have 1 player', () => {
      jest.spyOn(repo, 'createGameState');
      service.createRoom(roomId, name, avatar);

      expect(repo.createGameState).toBeCalledTimes(1);
      expect(repo.getGameState(roomId)).toBeDefined();
    });
  });
});
