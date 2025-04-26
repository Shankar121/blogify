import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findUserWithPasswordByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(userId: string, data: any): Promise<User | null> {
    console.log('updateUser', userId, data);
    return this.userModel.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true, runValidators: true },
    );
  }
}
