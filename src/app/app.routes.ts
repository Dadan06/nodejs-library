import { Router } from 'express';
import * as passport from 'passport';
import { authenticationRoutes } from '../authentication/authentication.routes';
import { privilegeRoutes } from '../privilege/privilege.route';
import { productRoutes } from '../product/product.route';
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
        this.router.use('/user', passport.authenticate('jwt', { session: false }), userRoutes);
        this.router.use(
            '/product',
            passport.authenticate('jwt', { session: false }),
            productRoutes
        );
    }
}

const appRouter = new AppRouter();
export const appRoutes = appRouter.router;
