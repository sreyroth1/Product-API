import { Document } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICounter extends Document {
  _id: string;
  seq: number;
}
