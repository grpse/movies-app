import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedUserModel } from './models/authed-user.model';

export const AuthedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): AuthedUserModel => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
