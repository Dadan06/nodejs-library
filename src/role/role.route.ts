import { Router } from 'express';
import { roleController } from './role.controller';

class RoleRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(roleController.getPaginatedList.bind(roleController))
            .post(roleController.create.bind(roleController));
        this.router.route('/all').get(roleController.getAll.bind(roleController));
        this.router
            .route('/:roleId')
            .get(roleController.getById.bind(roleController))
            .put(roleController.update.bind(roleController))
            .delete(roleController.delete.bind(roleController));
        this.router
            .route('/check-duplicate')
            .post(roleController.checkDuplicate.bind(roleController));
    }
}

const roleRouter = new RoleRouter();

export const roleRoutes = roleRouter.router;
