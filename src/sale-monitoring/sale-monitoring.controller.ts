import { NextFunction, Request, Response } from 'express';
import { PaginatedSale } from '../sale/sale.model';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { saleMonitoringService } from './sale-monitoring.service';

class SaleMonitoringController {
    getSales(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedSale>(
            saleMonitoringService.getSales(criteria, page),
            res,
            next
        );
    }
}

export const saleMonitoringController = new SaleMonitoringController();
