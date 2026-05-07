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

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  /**
   * Simple hash function to generate deterministic numeric IDs
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100000; // 0-99999
  }

  /**
   * Convert MongoDB document to response DTO (replace _id with numeric id)
   */
  private formatUserResponse(user: IUser): UserResponseDTO {
    return {
      id: user.userId || this.simpleHash(user._id.toString()),
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
  // Create a new user
  async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
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
      
      const savedUser = await user.save();
      return this.formatUserResponse(savedUser);
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async getAllUsers(skip: number = 0, limit: number = 10): Promise<UserResponseDTO[]> {
    try {
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      return users.map(user => this.formatUserResponse(user));
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<UserResponseDTO> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return this.formatUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<UserResponseDTO | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return null;
      }
      return this.formatUserResponse(user);
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(userId: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
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

      return this.formatUserResponse(updatedUser);
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
