import { Router } from 'express';
import { pdfController } from './pdf.controller';

class PdfRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.route('/payment/:paymentId').all(pdfController.payment.bind(pdfController));
    }
}

const pdfRouter = new PdfRouter();

export const pdfRoutes = pdfRouter.router;
