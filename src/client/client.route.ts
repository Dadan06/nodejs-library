import { Router } from 'express';
import { clientController } from './client.controller';

class ClientRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(clientController.getPaginatedList.bind(clientController))
            .post(clientController.create.bind(clientController));
        this.router.route('/all').get(clientController.getAll.bind(clientController));
        this.router
            .route('/:clientId')
            .get(clientController.getById.bind(clientController))
            .put(clientController.update.bind(clientController))
            .delete(clientController.delete.bind(clientController));
    }
}

const clientRouter = new ClientRouter();

export const clientRoutes = clientRouter.router;
