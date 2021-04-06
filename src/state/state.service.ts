import { Inject, Injectable } from '@nestjs/common';
import { StateRepository } from './state.repo';

@Injectable()
export class StateService {
  constructor(
    @Inject('StateRepository') private readonly repo: StateRepository,
  ) {}

  createRoom(roomId: string, name: string, avatar: string) {
    this.repo.createGameState(roomId, name, avatar);
  }

  joinRoom(roomId: string, name: string, avatar: string) {
    const gameState = this.repo.getGameState(roomId);
    gameState.addPlayer(name, avatar);
  }
}
