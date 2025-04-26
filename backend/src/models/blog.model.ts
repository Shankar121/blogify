import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Blog {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
