import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no roles required → allow
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }
    const userRole = user.role ?? user.user?.role;

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }
    return true;
  }
}
