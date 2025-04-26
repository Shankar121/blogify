import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorId: string; // userId

  @Prop({ default: [] })
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.index({ title: 'text', content: 'text' }); // Create a text index on title and content
BlogSchema.index({ authorId: 1 }); // Create an index on authorId for faster queries
BlogSchema.index({ createdAt: -1 }); // Create an index on createdAt for sorting
