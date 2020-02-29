import { Router } from 'express';
import { paymentController } from './payment.controller';

class SupplierRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/consignation')
            .get(paymentController.getConsignations.bind(paymentController));
        this.router
            .route('/')
            .get(paymentController.getPaginatedList.bind(paymentController))
            .post(paymentController.create.bind(paymentController));
        this.router
            .route('/:paymentId')
            .get(paymentController.getById.bind(paymentController))
            .put(paymentController.update.bind(paymentController))
            .delete(paymentController.delete.bind(paymentController));
    }
}

const paymentRouter = new SupplierRouter();

export const paymentRoutes = paymentRouter.router;
