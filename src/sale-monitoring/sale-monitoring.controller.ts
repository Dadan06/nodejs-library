import { NextFunction, Request, Response } from 'express';
import { PaginatedSale, Sale } from '../sale/sale.model';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { saleMonitoringService } from './sale-monitoring.service';

class SaleMonitoringController {
    getSales(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, by, direction, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        const order = { by, direction };
        wrapToSendBackResponse<PaginatedSale>(
            saleMonitoringService.getSales(criteria, page, order),
            res,
            next
        );
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Sale | null>(
            saleMonitoringService.getById(req.params.saleId),
            res,
            next
        );
    }
}

export const saleMonitoringController = new SaleMonitoringController();
