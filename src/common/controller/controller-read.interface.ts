import { NextFunction, Request, Response } from 'express';

export interface ControllerRead {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void;
    getById(req: Request, res: Response, next: NextFunction): void;
}
