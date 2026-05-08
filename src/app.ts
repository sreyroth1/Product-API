import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';

export const createApp = (): Express => {
  const app: Express = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Routes 
  app.use('/api/users', userRoutes);

  // Health Check 
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString()
    });
  });

  // Handler Error 404
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  return app;
};

export default createApp;
