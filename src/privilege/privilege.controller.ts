import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Privilege } from './privilege.model';
import { PaginatedPrivilege, privilegeService } from './privilege.service';

class PrivilegeController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        wrapToSendBackResponse<PaginatedPrivilege>(
            privilegeService.getPaginatedList(criteria, page),
            res,
            next
        );
    }

    getAll(rea: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Privilege[]>(privilegeService.getAll(), res, next);
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Privilege | null>(
            privilegeService.getById(req.params.privilegeId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Privilege>(privilegeService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(privilegeService.delete(req.params.privilegeId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Privilege | null>(
            privilegeService.update(req.params.privilegeId, req.body),
            res,
            next
        );
    }
}

export const privilegeController = new PrivilegeController();
