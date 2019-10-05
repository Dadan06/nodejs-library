import { Router } from 'express';
import { userController } from './user.controller';

class UserRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router
            .route('/')
            .get(userController.getPaginatedList.bind(userController))
            .post(userController.create.bind(userController));
        this.router
            .route('/:userId')
            .get(userController.getById.bind(userController))
            .put(userController.update.bind(userController))
            .delete(userController.delete.bind(userController));
    }
}

const userRouter = new UserRouter();

export const userRoutes = userRouter.router;
