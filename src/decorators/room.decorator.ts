import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const Room = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient<Socket>();
  return Object.keys(client.rooms).find(r => r !== client.id);
});
