import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from 'src/schemas/blog.schema';
import { CreateBlogInput } from 'src/dtos/blog-input.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(createBlogInput: CreateBlogInput): Promise<Blog> {
    const newBlog = new this.blogModel(createBlogInput);
    return newBlog.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName email')
      .exec();
  }

  async findByAuthorId(author: string): Promise<Blog[]> {
    return this.blogModel.find({ author }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Blog> {
    return this.blogModel.findById(id).exec();
  }
}
