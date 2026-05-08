import { Request, Response } from 'express';
import { BaseController } from './baseController';
import userService from '../services/user.service';

// User Controller
export class UserController extends BaseController {
  // Create user
  async create(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const { name, email, phone, age } = req.body;

      // Input validation
      if (!name || !email) {
        return this.sendError(res, 'Name and email are required', 400);
      }

      const user = await userService.createUser({ name, email, phone, age });
      return this.sendSuccess(res, user, 201);
    });
  }

  // Get all users
  async getAll(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await userService.getAllUsers(skip, limit);
      const total = await userService.getUserCount();

      return this.sendSuccess(res, {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    });
  }

  // Get user by ID
  async getById(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return this.sendSuccess(res, user);
    });
  }

  // Get user by email
  async getByEmail(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const { email } = req.query;

      if (!email) {
        return this.sendError(res, 'Email query parameter is required', 400);
      }

      const user = await userService.getUserByEmail(email as string);

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, user);
    });
  }

  // Update user
  async update(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userService.updateUser(id, updateData);
      return this.sendSuccess(res, user);
    });
  }

  // Delete user
  async delete(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const { id } = req.params;
      await userService.deleteUser(id);
      return this.sendSuccess(res, { message: 'User deleted successfully' });
    });
  }

  // Get user count
  async getCount(req: Request, res: Response): Promise<void> {
    await this.handleAsyncError(res, async () => {
      const count = await userService.getUserCount();
      return this.sendSuccess(res, { count });
    });
  }
}

export default new UserController();
