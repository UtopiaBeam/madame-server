import { Module } from '@nestjs/common';
import { StateModule } from 'src/state/state.module';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [StateModule],
  providers: [RoomGateway, RoomService],
})
export class RoomModule {}
