import { Resolver, Mutation, Args, Context, GqlExecutionContext, Query } from '@nestjs/graphql';
import { AuthService } from 'src/services/auth.service';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { User } from 'src/models/user.model';
import { RegisterUserInput } from 'src/dtos/register-user-input.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { Response } from 'express';
@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(email, password);

    if (!user) throw new Error('Invalid credentials');

    const { accessToken, refreshToken } = await this.authService.login(user);

    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax', // CSRF protection
      secure: process.env.ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    context.res.cookie('jid', refreshToken, {
      httpOnly: true,
      path: '/refresh_token',
      sameSite: 'strict',
      secure: process.env.ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 day
    });

    return { accessToken, refreshToken };
  }

  @Mutation(() => User)
  async register(@Args('data') data: RegisterUserInput): Promise<User> {
    const createdUser = await this.authService.register(data);
    const user = new User();
    user.id = createdUser._id.toString();
    user.firstName = createdUser.firstName;
    user.lastName = createdUser.lastName;
    user.email = createdUser.email;
    user.phone = createdUser.phone;
    return user;
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(AuthGuard)
  async findUser(@Context() context: any) {
    console.log('Current user:', context.req.user);
    return context.req.user;
  }

  @Mutation(() => Boolean)
  async logout(@Context('res') res: Response): Promise<boolean> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return true;
  }
}
