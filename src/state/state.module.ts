import { Module } from '@nestjs/common';
import { StateRepository } from './state.repo';
import { StateService } from './state.service';

@Module({
  providers: [
    StateService,
    { provide: 'STATE_REPO', useClass: StateRepository },
  ],
})
export class StateModule {}
