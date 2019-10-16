import { Router } from 'express';
import { privilegeController } from './privilege.controller';

class PrivilegeRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(privilegeController.getPaginatedList.bind(privilegeController))
            .post(privilegeController.create.bind(privilegeController));
        this.router.route('/all').get(privilegeController.getAll.bind(privilegeController));
        this.router
            .route('/:privilegeId')
            .get(privilegeController.getById.bind(privilegeController))
            .put(privilegeController.update.bind(privilegeController))
            .delete(privilegeController.delete.bind(privilegeController));
    }
}

const privilegeRouter = new PrivilegeRouter();

export const privilegeRoutes = privilegeRouter.router;
