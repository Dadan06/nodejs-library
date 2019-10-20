import { app } from './app/app';
import { config } from './app/app.config';
import { database } from './app/app.database';
import { logger } from './app/app.logger';

logger.info('Starting application ...');

database.connect(() => {
    app.init(config.server.port);
});
