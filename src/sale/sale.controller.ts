import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { Payment } from '../payment/payment.model';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Sale } from './sale.model';
import { PaginatedSale, saleService } from './sale.service';

class SaleController implements ControllerRead {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedSale>(
            saleService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Sale | null>(saleService.getById(req.params.saleId), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(saleService.delete(req.params.saleId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Sale | null>(
            saleService.update(req.params.saleId, req.body),
            res,
            next
        );
    }

    saveSale(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Payment>(saleService.saveSale(req.body), res, next);
    }
}

export const saleController = new SaleController();
