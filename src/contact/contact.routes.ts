import { Router } from 'express';
import { contactController } from './contact.controller';

class ContactRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(contactController.getPaginatedList.bind(contactController))
            .post(contactController.create.bind(contactController));
        this.router
            .route('/:contactId')
            .get(contactController.getById.bind(contactController))
            .put(contactController.update.bind(contactController))
            .delete(contactController.delete.bind(contactController));
    }
}

const contactRouter = new ContactRouter();

export const contactRoutes = contactRouter.router;
