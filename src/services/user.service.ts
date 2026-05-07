import { User, IUser } from '../models/user.model';

export interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  age?: number;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
}

export class UserService {
  // Create a new user
  async createUser(data: CreateUserDTO): Promise<IUser> {
    try {
      this.validateUserInput(data);
      
      // Check if email already exists
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        throw new Error('Email already registered');
      }
      
      const user = new User({
        ...data,
        email: data.email.toLowerCase().trim(),
        name: data.name.trim()
      });
      
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async getAllUsers(skip: number = 0, limit: number = 10): Promise<IUser[]> {
    try {
      return await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(userId: string, data: UpdateUserDTO): Promise<IUser> {
    try {
      if (Object.keys(data).length === 0) {
        throw new Error('No fields to update');
      }

      // If email is being updated, check if it's already in use
      if (data.email) {
        const existingUser = await User.findOne({
          email: data.email.toLowerCase(),
          _id: { $ne: userId }
        });
        if (existingUser) {
          throw new Error('Email already in use');
        }
        data.email = data.email.toLowerCase().trim();
      }

      if (data.name) {
        data.name = data.name.trim();
      }

      this.validateUserInput(data);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  }

  // Get user count
  async getUserCount(): Promise<number> {
    try {
      return await User.countDocuments();
    } catch (error) {
      throw error;
    }
  }

  // Private validation method
  private validateUserInput(data: Partial<CreateUserDTO>): void {
    if (data.name !== undefined && typeof data.name !== 'string') {
      throw new Error('Name must be a string');
    }
    
    if (data.email !== undefined && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }
  }
}

export default new UserService();
