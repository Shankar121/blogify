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
import { PubSub } from 'graphql-subscriptions';

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
      installSubscriptionHandlers: true,
      playground: true, // Enable playground for testing
      subscriptions: {
        'graphql-ws': {
          path: '/graphql', // Set WebSocket path
          onConnect: () => {
            console.log('Client connected via WebSocket');
          },
          onDisconnect: (ctx: any, code: number, reason: string) => {
            console.log('Client disconnected from WebSocket', code, reason);
          },
          onSubscribe: (ctx: any, message: any) => {
            console.error('onSubscribe called', message);
          },
          onClose: (ctx: any, code: number, reason: string) => {
            console.error('onClose called', code, reason);
          },
          onNext: (ctx: any, message: any) => {
            console.error('onNext called', JSON.stringify(message));
          },
        },
      },
    }),
    AuthModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersModule, AuthModule, HealthCheckResolver, BlogModule, PubSub],
})
export class AppModule {}
