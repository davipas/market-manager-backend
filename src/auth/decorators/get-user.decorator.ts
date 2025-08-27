import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request);
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }
    if (data) {
      return user[data];
    } else {
      return user;
    }
  },
);
