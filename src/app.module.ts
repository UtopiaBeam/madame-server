import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [RoomModule, StateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
