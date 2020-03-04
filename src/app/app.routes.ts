import { Router } from 'express';
import * as passport from 'passport';
import { authenticationRoutes } from '../authentication/authentication.routes';
import { clientRoutes } from '../client/client.route';
import { paymentRoutes } from '../payment/payment.route';
import { pdfRoutes } from '../pdf/pdf.route';
import { privilegeRoutes } from '../privilege/privilege.route';
import { productRoutes } from '../product/product.route';
import { roleRoutes } from '../role/role.route';
import { saleItemRoutes } from '../sale-item/sale.route';
import { saleMonitoringRoutes } from '../sale-monitoring/sale-monitoring.route';
import { saleRoutes } from '../sale/sale.route';
import { supplierRoutes } from '../supplier/supplier.route';
import { userRoutes } from '../user/user.route';
import { viewsRoutes } from '../views/views.route';

class AppRouter {
    router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    // tslint:disable-next-line: no-big-function
    init() {
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
        this.router.use(
            '/supplier',
            passport.authenticate('jwt', { session: false }),
            supplierRoutes
        );
        this.router.use('/sale', passport.authenticate('jwt', { session: false }), saleRoutes);
        this.router.use(
            '/sale-item',
            passport.authenticate('jwt', { session: false }),
            saleItemRoutes
        );
        this.router.use('/client', passport.authenticate('jwt', { session: false }), clientRoutes);
        this.router.use(
            '/payment',
            passport.authenticate('jwt', { session: false }),
            paymentRoutes
        );
        this.router.use(
            '/sale-monitoring',
            passport.authenticate('jwt', { session: false }),
            saleMonitoringRoutes
        );
        this.router.use('/views', viewsRoutes);
        this.router.use('/pdf', pdfRoutes);
    }
}

const appRouter = new AppRouter();
export const appRoutes = appRouter.router;
