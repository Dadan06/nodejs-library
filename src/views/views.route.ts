import { Router } from 'express';
import { viewsController } from './views.controller';

class ViewsRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/payment/:paymentId')
            .all(
                viewsController.fetchPayment.bind(viewsController),
                viewsController.renderPayment.bind(viewsController)
            );
    }
}

const viewsRouter = new ViewsRouter();

export const viewsRoutes = viewsRouter.router;
