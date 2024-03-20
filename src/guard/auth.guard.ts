import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../strategy/public.auth';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  // 实例化 jwtService
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    // 获取请求的内容
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('token 验证没有通过');
      throw new UnauthorizedException();
    }
    try {
      // 生成token 通过 jwtService.verifyAsync
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SECRET', 'test123456'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log(payload)
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  // 通过 请求头拿到 token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return token
    return type === 'Bearer' ? token : undefined;
  }
}
