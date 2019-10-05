import * as appRoot from 'app-root-path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import * as morgan from 'morgan';
import passport from './app.authentication';
import { config } from './app.config';
import { errorMiddleware } from './app.error-middleware';
import { logger, morganStream } from './app.logger';
import { appRoutes } from './app.routes';

export class App {
    private readonly app: express.Application;

    constructor() {
        this.app = express();
    }

    public init(port: number): Server {
        config.environment !== 'production' && this.enableCors();
        this.initMiddlewares();
        this.initRoutes();
        this.initStatics();
        this.initErrorHandlerMiddeware();
        return this.app.listen(port, () => {
            logger.info(`app started, listening on port ${port}`);
        });
    }

    private initMiddlewares() {
        this.app.use(passport.initialize());
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morgan('combined', { stream: morganStream }));
    }

    private initErrorHandlerMiddeware() {
        this.app.use(errorMiddleware);
    }

    private initRoutes() {
        this.app.use('/api/v1', appRoutes);
    }

    private initStatics() {
        // initilize front-end static files serving:
        this.app.use(express.static(`${appRoot}/public`));
    }

    private enableCors() {
        this.app.use(cors());
    }
}

export const app = new App();
