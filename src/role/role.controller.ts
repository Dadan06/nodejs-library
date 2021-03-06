import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Role } from './role.model';
import { PaginatedRole, roleService } from './role.service';

class RoleController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, by, direction, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        const order = { by, direction };
        wrapToSendBackResponse<PaginatedRole>(
            roleService.getPaginatedList(criteria, page, order),
            res,
            next
        );
    }

    getAll(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Role[]>(roleService.getAll(), res, next);
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Role | null>(roleService.getById(req.params.roleId), res, next);
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Role>(roleService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(roleService.delete(req.params.roleId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Role | null>(
            roleService.update(req.params.roleId, req.body),
            res,
            next
        );
    }

    checkDuplicate(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(roleService.checkDuplicate(req.body), res, next);
    }
}

export const roleController = new RoleController();
