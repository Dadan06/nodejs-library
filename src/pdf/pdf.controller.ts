import { NextFunction, Request, Response } from 'express';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { pdfService } from './pdf.service';

class PdfController {
    payment(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<string>(pdfService.payment(req.params.paymentId), res, next);
    }
}

export const pdfController = new PdfController();
