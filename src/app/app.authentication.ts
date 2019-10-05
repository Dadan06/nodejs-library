import { Request } from 'express';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { config } from '../app/app.config';
import { userRepository } from '../user/user.repository';

const localStrategy = new LocalStrategy(
    { usernameField: 'login' },
    async (login, password, done) => {
        try {
            const user = await userRepository
                .findOne({ login })
                .populate({
                    path: 'role',
                    populate: { path: 'privileges' }
                })
                .exec();
            const validPassword = await (user && user.validPassword(password));
            if (!user || !validPassword) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const extractTokenFromParams = (req: Request) => (req.params && req.params.token) || null;

const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: config.jwt.secretKey,
        jwtFromRequest: ExtractJwt.fromExtractors([
            extractTokenFromParams, // Extract token for WebSocket
            ExtractJwt.fromAuthHeaderAsBearerToken() // Extract token for Http
        ])
    },
    async (jwtPayload, done) => {
        try {
            const user = await userRepository.findById(jwtPayload._id).exec();
            return user ? done(null, user) : done(null, false);
        } catch (error) {
            return done(error);
        }
    }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
