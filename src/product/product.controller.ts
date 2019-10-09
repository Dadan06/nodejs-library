import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Product } from './product.model';
import { PaginatedProduct, productService } from './product.service';

class ProductController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedProduct>(
            productService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Product | null>(
            productService.getById(req.params.productId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Product>(productService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(productService.delete(req.params.productId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Product | null>(
            productService.update(req.params.productId, req.body),
            res,
            next
        );
    }

    checkDuplicate(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(productService.checkDuplicate(req.body), res, next);
    }
}

export const productController = new ProductController();
