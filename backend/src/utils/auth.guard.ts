import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { GqlRequest } from './gql.request';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as GqlRequest;
    const token = request?.cookies?.['access_token'];
    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }
    try {
      const user = this.jwtService.verify(token);
      const userData = await this.userService.findByEmail(user.email);
      request.user = userData;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
