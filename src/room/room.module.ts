import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [GameModule],
  providers: [RoomGateway, RoomService],
})
export class RoomModule {}
