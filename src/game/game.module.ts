import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { StateRepository } from './state.repo';

@Module({
  providers: [GameService, GameGateway, StateRepository],
  exports: [GameService],
})
export class GameModule {}
