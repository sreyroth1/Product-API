import { Response } from 'express';

export class BaseController {

    protected sendSuccess(
        res: Response,
        data: any,
        statusCode: number = 200
    ): Response {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    protected sendError(
        res: Response,
        message: string,
        statusCode: number = 400
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }

    protected async handleAsyncError(
        res: Response,
        asyncFn: () => Promise<any>
    ): Promise<any> {
        try {
            return await asyncFn();
        } catch (error) {
            if (error instanceof Error) {
                return this.sendError(res, error.message, 400);
            }
            return this.sendError(res, 'An unexpected error occurred', 500);
        }
    }
}
