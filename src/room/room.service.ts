import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PlayerState } from '../state/player-state';
import { StateService } from '../state/state.service';
import { CreateRoomMessage, JoinRoomMessage } from './room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly stateService: StateService) {}

  getCurrentRoom(client: Socket): string | undefined {
    return Object.keys(client.rooms).find(r => r !== client.id);
  }

  private randomRoomId(min = 0, max = 99999): string {
    const roomNumber = Math.floor(min + Math.random() * (max - min + 1));
    return String(roomNumber).padStart(5, '0');
  }

  createRoom({ name, avatar }: CreateRoomMessage): string {
    const roomId = this.randomRoomId();
    this.stateService.createRoom(roomId, name, avatar);

    return roomId;
  }

  joinRoom({ roomId, name, avatar }: JoinRoomMessage) {
    this.stateService.joinRoom(roomId, name, avatar);
  }

  getPlayers(roomId: string): PlayerState[] {
    return this.stateService.getRoomGameState(roomId).players;
  }
}
