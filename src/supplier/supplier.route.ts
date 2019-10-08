import { Router } from 'express';
import { supplierController } from './supplier.controller';

class SupplierRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(supplierController.getPaginatedList.bind(supplierController))
            .post(supplierController.create.bind(supplierController));
        this.router.route('/all').get(supplierController.getAll.bind(supplierController));
        this.router
            .route('/:supplierId')
            .get(supplierController.getById.bind(supplierController))
            .put(supplierController.update.bind(supplierController))
            .delete(supplierController.delete.bind(supplierController));
    }
}

const supplierRouter = new SupplierRouter();

export const supplierRoutes = supplierRouter.router;
