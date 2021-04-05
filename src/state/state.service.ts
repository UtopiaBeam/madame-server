import { Inject, Injectable } from '@nestjs/common';
import { StateRepository } from './state.repo';

@Injectable()
export class StateService {
  constructor(@Inject('STATE_REPO') private readonly repo: StateRepository) {}

  addPlayer(roomId: string, name: string, avatar: string) {
    const gameState = this.repo.getGameState(roomId);
    gameState.addPlayer(name, avatar);
  }
}
