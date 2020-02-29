import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Supplier } from './supplier.model';
import { PaginatedSupplier, supplierService } from './supplier.service';

class SupplierController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, by, direction, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        const order = { by, direction };
        wrapToSendBackResponse<PaginatedSupplier>(
            supplierService.getPaginatedList(criteria, page, order),
            res,
            next
        );
    }

    getAll(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Supplier[]>(supplierService.getAll(), res, next);
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Supplier | null>(
            supplierService.getById(req.params.supplierId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Supplier>(supplierService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(supplierService.delete(req.params.supplierId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Supplier | null>(
            supplierService.update(req.params.supplierId, req.body),
            res,
            next
        );
    }
}

export const supplierController = new SupplierController();
