import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import e from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ hoặc không thể tìm ở Header Authorization',
        )
      );
    }
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path as string;

    const permissions = user?.permissions ?? [];
    let isExits = permissions.find(
      (permission) =>
        permission.method === targetMethod &&
        permission.apiPath === targetEndpoint,
    );

    if (targetEndpoint.startsWith('/api/v1/auth')) isExits = true;
    if (!isExits) {
      console.log(permissions);
      throw new ForbiddenException(
        `Không có quyền truy cập endpoint ${targetMethod} ${targetEndpoint}`,
      );
    }
    return user;
  }
}
