import { Router } from 'express';
import * as passport from 'passport';
import { authenticationRoutes } from '../authentication/authentication.routes';
import { contactRoutes } from '../contact/contact.routes';
import { privilegeRoutes } from '../privilege/privilege.route';
import { roleRoutes } from '../role/role.route';
import { userRoutes } from '../user/user.route';

class AppRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/api-status', (req, res) => res.json({ status: 'API is OK' }));
        this.router.use('/authentication', authenticationRoutes);
        this.router.use('/role', passport.authenticate('jwt', { session: false }), roleRoutes);
        this.router.use(
            '/privilege',
            passport.authenticate('jwt', { session: false }),
            privilegeRoutes
        );
        this.router.use(
            '/contact',
            // passport.authenticate('jwt', { session: false }),
            contactRoutes
        );
        this.router.use('/user', passport.authenticate('jwt', { session: false }), userRoutes);
    }
}

const appRouter = new AppRouter();
export const appRoutes = appRouter.router;
