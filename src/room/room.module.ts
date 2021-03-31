import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  providers: [RoomGateway, RoomService]
})
export class RoomModule {}
