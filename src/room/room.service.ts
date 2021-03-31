import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService {
  getCurrentRoom(client: Socket): string | undefined {
    return Object.keys(client.rooms).find(r => r !== client.id);
  }

  randomRoomId(min = 0, max = 10000): string {
    const roomNumber = Math.floor(min + Math.random() * (max - min + 1));
    return String(roomNumber).padStart(5, '0');
  }
}
