import { NextFunction, Request, Response } from 'express';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { AuthenticationResponse } from './authentication.model';
import { authenticationService } from './authentication.service';

class AuthenticationController {
    logIn(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<AuthenticationResponse>(
            authenticationService.logIn(req, res),
            res,
            next
        );
    }
}

export const authenticationController = new AuthenticationController();
