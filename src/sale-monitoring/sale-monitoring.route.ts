import { Router } from 'express';
import { saleMonitoringController } from './sale-monitoring.controller';

class SaleMonitoringRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(saleMonitoringController.getSales.bind(saleMonitoringController));
    }
}

const saleMonitoringRouter = new SaleMonitoringRouter();

export const saleMonitoringRoutes = saleMonitoringRouter.router;
