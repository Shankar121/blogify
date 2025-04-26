import { Resolver, Query, Mutation, Args, Context, Subscription } from '@nestjs/graphql';
import { BlogService } from '../services/blog.service';
import { Blog } from 'src/models/blog.model';
import { CreateBlogInput } from 'src/dtos/blog-input.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Blog)
export class BlogResolver {
  constructor(private readonly blogService: BlogService, private pubSub: PubSub) {}

  @Query(() => [Blog], { name: 'blogs' })
  @UseGuards(AuthGuard)
  findAll() {
    return this.blogService.findAll();
  }

  @Query(() => [Blog], { name: 'myblogs' })
  @UseGuards(AuthGuard)
  findByAuthorId(@Context() context: any) {
    const user = context.req.user;
    return this.blogService.findByAuthorId(user._id);
  }

  @Query(() => Blog, { name: 'blog' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Subscription(() => Blog, {
    resolve: (value) => value, // Modify if needed
  })
  blogCreated() {
    return this.pubSub.asyncIterator('blogCreated');
  }

  @Mutation(() => Blog)
  @UseGuards(AuthGuard)
  async createBlog(@Context() context: any, @Args('data') data: CreateBlogInput) {
    try {
      const user = context.req.user;
      const blog = await this.blogService.create({ ...data, author: user._id });
      if (!blog) {
        throw new Error('Blog creation failed');
      }
      await this.pubSub.publish('blogCreated', blog);
      return blog;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new Error('Failed to create blog');
    }
  }
}
