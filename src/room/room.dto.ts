export interface CreateRoomMessage {
  name: string;
  avatar: string;
}

export interface JoinRoomMessage extends CreateRoomMessage {
  roomId: string;
}
