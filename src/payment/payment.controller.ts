import { NextFunction, Request, Response } from 'express-serve-static-core';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Payment } from './payment.model';
import { PaginatedPayment, paymentService } from './payment.service';

class PaymentController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedPayment>(
            paymentService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getAll(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Payment[]>(paymentService.getAll(), res, next);
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Payment | null>(
            paymentService.getById(req.params.paymentId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Payment>(paymentService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(paymentService.delete(req.params.paymentId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Payment | null>(
            paymentService.update(req.params.paymentId, req.body),
            res,
            next
        );
    }

    getConsignations(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, by, direction, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        const order = { by, direction };
        wrapToSendBackResponse<PaginatedPayment>(
            paymentService.getConsignations(criteria, page, order),
            res,
            next
        );
    }
}

export const paymentController = new PaymentController();
