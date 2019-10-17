import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Sale } from './sale.model';
import { saleService, PaginatedSale } from './sale.service';

class SaleController implements ControllerRead, ControllerWrite {
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
        wrapToSendBackResponse<Sale | null>(
            saleService.getById(req.params.saleId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Sale>(saleService.create(req.body), res, next);
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
}

export const saleController = new SaleController();