import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { HealthCheckResolver } from './resolvers/health-check.resolvers';
import { BlogModule } from './modules/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      cors: false,
    }),
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersModule, AuthModule, HealthCheckResolver, BlogModule],
})
export class AppModule {}
