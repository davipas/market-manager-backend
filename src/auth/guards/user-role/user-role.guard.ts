import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    console.log(`Valid roles from guard: ${validRoles}`);
    if (!validRoles) {
      return true;
    }
    if (validRoles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    console.log('user from guard', user);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (validRoles.includes(user.role.name)) {
      return true;
    }
    throw new ForbiddenException('User not authorized');
  }
}
