import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from '../state/state.service';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let stateService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: StateService,
          useValue: {
            createRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    stateService = module.get<StateService>(StateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call stateService', () => {
    const name = 'john doe';
    const avatar = '/path/to/avatar';

    jest.spyOn(service, 'getCurrentRoom').mockReturnValue(undefined);
    jest.spyOn(stateService, 'createRoom');

    const roomId = service.createRoom({ name, avatar });

    expect(stateService.createRoom).toBeCalledTimes(1);
    expect(stateService.createRoom).toBeCalledWith(roomId, name, avatar);
  });
});
