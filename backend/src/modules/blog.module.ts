import { Blog, BlogSchema } from 'src/schemas/blog.schema';
import { BlogService } from 'src/services/blog.service';
import { BlogResolver } from 'src/resolvers/blog.resolvers';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/utils/jwt.utils';
import { UsersService } from 'src/services/users.service';
import { UsersModule } from './users.module';
import { PubSub } from 'graphql-subscriptions';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('REFRESH_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [BlogService, JwtStrategy, BlogResolver, UsersService, PubSub],
})
export class BlogModule {}
