import * as mongoose from 'mongoose';

import { config } from './app.config';
import { logger } from './app.logger';

class Database {
    connect(cb: () => void) {
        const connexionString = config.mongodb.dbURI;

        mongoose.connect(connexionString);

        mongoose.connection.on('connected', () => {
            logger.info(`connected to database: ${connexionString}`);
        });

        mongoose.connection.once('open', () => {
            cb();
        });

        mongoose.connection.on('error', () => {
            throw new Error(`unable to connect to database: ${connexionString}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.error(`Disconnected to database: ${connexionString}`);
        });
    }
}

export const database = new Database();
