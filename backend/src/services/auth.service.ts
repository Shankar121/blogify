import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas/user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(user: any): Promise<any> {
    const existing = await this.usersService.findByEmail(user.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    return await this.usersService.create(user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserWithPasswordByEmail(email);
    if (user?.email) {
      const isMatch = await bcrypt.compare(password, user?.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };
    console.log('payload', payload);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '7d',
    });
    console.log('payload', user._id?.toString(), { refreshToken });
    await this.usersService.updateUser(user._id?.toString(), { refreshToken });

    return { accessToken, refreshToken };
  }
}
