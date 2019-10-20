import { Router } from 'express';
import { saleController } from './sale.controller';

class SaleRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(saleController.getPaginatedList.bind(saleController))
            .post(saleController.create.bind(saleController));
        this.router
            .route('/:saleId/add-product')
            .post(saleController.addProduct.bind(saleController));
        this.router
            .route('/:saleId')
            .get(saleController.getById.bind(saleController))
            .put(saleController.update.bind(saleController))
            .delete(saleController.delete.bind(saleController));
    }
}

const saleRouter = new SaleRouter();

export const saleRoutes = saleRouter.router;
