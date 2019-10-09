import { Router } from 'express';
import { productController } from './product.controller';

class ProductRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(productController.getPaginatedList.bind(productController))
            .post(productController.create.bind(productController));
        this.router
            .route('/:roleId')
            .get(productController.getById.bind(productController))
            .put(productController.update.bind(productController))
            .delete(productController.delete.bind(productController));
        this.router
            .route('/check-duplicate')
            .post(productController.checkDuplicate.bind(productController));
    }
}

const productRouter = new ProductRouter();

export const productRoutes = productRouter.router;
