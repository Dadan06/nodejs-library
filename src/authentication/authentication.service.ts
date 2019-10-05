import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { config } from '../app/app.config';
import { AuthenticationResponse } from '../authentication/authentication.model';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';

class AuthenticationService {
    logIn(req: Request, res: Response): Promise<AuthenticationResponse> {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', { session: false }, (err, retUser, info) => {
                if (err || !retUser) {
                    reject(
                        new HttpException(
                            HttpStatusCode.UNAUTHORIZED,
                            `Nom d/'utilisateur/Mot de passe incorrect`
                        )
                    );
                }
                const user = { _id: retUser._id, login: retUser.login, role: retUser.role };
                const token = jwt.sign({ _id: user._id, login: user.login }, config.jwt.secretKey, {
                    expiresIn: config.jwt.expiration
                });
                resolve({ user, token });
            })(req, res);
        });
    }
}

export const authenticationService = new AuthenticationService();
