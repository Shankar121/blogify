import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])], // Register the model
  providers: [UsersService],
  exports: [UsersService, MongooseModule], // Export UsersService and MongooseModule to be used in other modules
})
export class UsersModule {}
