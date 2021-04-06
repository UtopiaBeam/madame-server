import { Player } from '../util/player';

export type CreateRoomMessage = Player;

export interface JoinRoomMessage extends CreateRoomMessage {
  roomId: string;
}
