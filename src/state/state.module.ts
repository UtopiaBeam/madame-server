import { Module } from '@nestjs/common';
import { StateRepository } from './state.repo';
import { StateService } from './state.service';

@Module({
  providers: [StateRepository, StateService],
  exports: [StateService],
})
export class StateModule {}
