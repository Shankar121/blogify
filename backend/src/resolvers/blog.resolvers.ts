import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BlogService } from '../services/blog.service';
import { Blog } from 'src/models/blog.model';
import { CreateBlogInput } from 'src/dtos/blog-input.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
@Resolver(() => Blog)
@UseGuards(AuthGuard)
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => [Blog], { name: 'blogs' })
  findAll() {
    return this.blogService.findAll();
  }

  @Query(() => [Blog], { name: 'myblogs' })
  findByAuthorId(@Context() context: any) {
    const user = context.req.user;
    return this.blogService.findByAuthorId(user._id);
  }

  @Query(() => Blog, { name: 'blog' })
  findOne(@Args('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Mutation(() => Blog)
  createBlog(@Context() context: any, @Args('data') createBlogInput: CreateBlogInput) {
    const user = context.req.user;
    return this.blogService.create({ ...createBlogInput, authorId: user._id });
  }
}
