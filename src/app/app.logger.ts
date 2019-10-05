import * as appRoot from 'app-root-path';
import * as winston from 'winston';

const myFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} - ${level}: ${message}`
);

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `${appRoot}/logs/infos.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 50
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true
        })
    ],
    format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), myFormat),
    exceptionHandlers: [
        new winston.transports.File({ filename: `${appRoot}/logs/exceptions.log` })
    ],
    exitOnError: false // do not exit on handled exceptions
});

class MorganStream {
    write(text: string) {
        logger.info(text.trim());
    }
}

export const morganStream = new MorganStream();
