import { NextFunction, Request, Response } from 'express';
import { Payment } from '../payment/payment.model';
import { paymentService } from '../payment/payment.service';
import { SALE_TYPE_LABELS } from '../sale/sale.constant';
import { toCurrency } from '../shared/utils/currency.utils';
import { toLocaleDateString } from '../shared/utils/date.utils';

// tslint:disable: no-any
class ViewsController {
    async fetchPayment(req: Request, res: Response, next: NextFunction) {
        const payment = await paymentService.getById(req.params.paymentId);
        (req as any).payment = payment;
        next();
    }

    async renderPayment(req: Request, res: Response, next: NextFunction) {
        const payment: Payment = (req as any).payment;
        res.render('./templates/sale.pug', {
            paymentDate: toLocaleDateString(payment.paymentDate),
            saleTypeLabels: SALE_TYPE_LABELS,
            payment,
            toCurrency
        });
    }
}

export const viewsController = new ViewsController();
