import { createLogger, transports, format } from 'winston';

const logConfiguration = {
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        }),
        new transports.File({
            filename: 'logs/logs.log'
        })
    ],
    format: format.combine(
        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        format.align(),
        format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    )
};

export const logger = createLogger(logConfiguration);
