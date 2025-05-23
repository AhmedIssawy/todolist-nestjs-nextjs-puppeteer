import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  category?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
  dueDate?: Date;
}
export const TaskSchema = SchemaFactory.createForClass(Task);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  linkedInUrl: string;

  @Prop({ default: '' })
  linkedinFullName: string;

  @Prop({ default: '' })
  linkedinProfilePicture: string;

  @Prop({ default: '' })
  linkedinHeadline: string;

  @Prop({ type: [TaskSchema], default: [] })
  taskList: Task[];

  @Prop()
  profilePicture?: string;

  @Prop()
  headline?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
