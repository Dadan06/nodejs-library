import { NextFunction, Request, Response } from 'express';
import { ControllerRead } from '../common/controller/controller-read.interface';
import { ControllerWrite } from '../common/controller/controller-write.interface';
import { Page } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { wrapToSendBackResponse } from '../shared/wrap-to-send-back-response';
import { Contact } from './contact.model';
import { contactService, PaginatedContact } from './contact.service';

class ContactController implements ControllerRead, ControllerWrite {
    getPaginatedList(req: Request, res: Response, next: NextFunction): void {
        const { page: pageNo, pageSize, ...criteria } = req.query;
        const page: Page = {
            page: Number(pageNo),
            pageSize: Number(pageSize)
        };
        const order: Sort<Contact> = { firstname: 'asc' };
        wrapToSendBackResponse<PaginatedContact>(
            contactService.getPaginatedList(criteria, page, order),
            res,
            next
        );
    }

    getById(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Contact | null>(
            contactService.getById(req.params.contactId),
            res,
            next
        );
    }

    create(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Contact>(contactService.create(req.body), res, next);
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<boolean>(contactService.delete(req.params.contactId), res, next);
    }

    update(req: Request, res: Response, next: NextFunction): void {
        wrapToSendBackResponse<Contact | null>(
            contactService.update(req.params.contactId, req.body),
            res,
            next
        );
    }
}

export const contactController = new ContactController();
