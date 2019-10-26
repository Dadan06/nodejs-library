import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Client } from './client.model';
import { clientService, PaginatedClient } from './client.service';

class ClientController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedClient>(
            clientService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getAll(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Client[]>(clientService.getAll(), res, next);
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Client | null>(
            clientService.getById(req.params.clientId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Client>(clientService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(clientService.delete(req.params.clientId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Client | null>(
            clientService.update(req.params.clientId, req.body),
            res,
            next
        );
    }
}

export const clientController = new ClientController();
