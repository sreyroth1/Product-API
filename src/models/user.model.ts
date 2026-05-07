import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: Number,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    phone: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150']
    }
  },
  {
    timestamps: true
  }
);

// Counter schema for auto-incrementing userId
interface ICounter extends Document {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model<ICounter>('Counter', CounterSchema);

// Pre-save hook to auto-increment userId
UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
