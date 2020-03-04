import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { SaleItem } from './sale-item.model';
import { PaginatedSaleItem, saleItemService } from './sale-item.service';

class SaleItemController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedSaleItem>(
            saleItemService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<SaleItem | null>(
            saleItemService.getById(req.params.saleItemId),
            res,
            next
        );
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(saleItemService.delete(req.params.saleItemId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<SaleItem | null>(
            saleItemService.update(req.params.saleItemId, req.body),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<SaleItem>(saleItemService.create(req.body), res, next);
    }
}

export const saleItemController = new SaleItemController();
