import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { Player } from '../util/player';
import { PlayerState } from '../util/player-state';

@Injectable()
export class RoomService {
  constructor(private readonly gameService: GameService) {}

  private randomRoomId(min = 0, max = 99999): string {
    const roomNumber = Math.floor(min + Math.random() * (max - min + 1));
    return String(roomNumber).padStart(5, '0');
  }

  createRoom(player: Player): string {
    const roomId = this.randomRoomId();
    this.gameService.createGameState(roomId, player);

    return roomId;
  }

  joinRoom(roomId: string, player: Player) {
    this.gameService.joinRoom(roomId, player);
  }

  getPlayers(roomId: string): PlayerState[] {
    return this.gameService.getGameState(roomId).playerStates;
  }
}
