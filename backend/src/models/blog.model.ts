import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class Blog {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author: User;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
