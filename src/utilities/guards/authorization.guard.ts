import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      // const result = request?.currentUser?.roles
      //   .map((role: string) => allowedRoles.includes(role))
      //   .find((val: boolean) => val === true);
      let result = request?.currentUser?.roles;
      result = allowedRoles.includes(result) ? true : false;
      if (result) return true;
      throw new UnauthorizedException();
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
