import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => String, { nullable: true })
  author?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
