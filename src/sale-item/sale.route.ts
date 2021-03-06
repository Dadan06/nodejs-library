import { Router } from 'express';
import { saleItemController } from './sale-item.controller';

class SaleItemRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(saleItemController.getPaginatedList.bind(saleItemController))
            .post(saleItemController.create.bind(saleItemController));
        this.router
            .route('/:saleItemId')
            .get(saleItemController.getById.bind(saleItemController))
            .put(saleItemController.update.bind(saleItemController))
            .delete(saleItemController.delete.bind(saleItemController));
    }
}

const saleItemRouter = new SaleItemRouter();

export const saleItemRoutes = saleItemRouter.router;
