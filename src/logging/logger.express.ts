require("newrelic");
require("winston-syslog").Syslog;
import winston, { createLogger, transports, format } from "winston";
const newrelicFormatter = require("@newrelic/winston-enricher");
import { Transports } from "winston/lib/winston/transports";
import { SyslogTransportInstance } from "winston-syslog";

/** hacking types for injected syslog transport */
const winstonTransports = winston.transports as Transports & {
    Syslog: SyslogTransportInstance;
};

export const successLog = createLogger({
    transports: [
        new transports.File({
            dirname: "./logs",
            filename: "activity-log.log",
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
                        metadata
                    )}`;
                })
            ),
        }),
    ],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.metadata(),
        format.timestamp(),
        format.printf(({ timestamp, message }) => {
            return `[${timestamp}]|| ${message}`;
        })
    ),
    defaultMeta: {
        service: "Northwest Data Sync",
    },
});

export const errorLog = createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winstonTransports.Syslog(),
        new transports.File({
            dirname: "./logs",
            filename: "error-log.log",
        }),
        new transports.Console({
            format: format.combine(
                format.label({ label: "test" }),

                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
                        metadata
                    )}`;
                })
            ),
        }),
    ],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.metadata(),
        format.timestamp(),
        format.printf(({ timestamp, message }) => {
            return `[${timestamp}]|| ${message}`;
        })
    ),
    defaultMeta: {
        service: "Northwest Data Sync",
    },
});

export const fieldLog = createLogger({
    transports: [
        new transports.File({
            dirname: "./logs",
            filename: "field-log.log",
        }),
        new transports.Console({
            level: "debug",
            silent: true,
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
                        metadata
                    )}`;
                })
            ),
        }),
    ],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.metadata(),
        format.timestamp(),
        format.printf(({ timestamp, message }) => {
            return `[${timestamp}] || ${message}`;
        })
    ),
    defaultMeta: {
        service: "Northwest Data Sync",
    },
});

export const runLog = createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winstonTransports.Syslog(),
        new transports.File({
            dirname: "./logs",
            filename: "run.log",
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    return `[${timestamp}] || ${message}. ${JSON.stringify(
                        metadata
                    )}`;
                })
            ),
        }),
    ],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.metadata(),
        format.timestamp(),
        format.printf(({ timestamp, message }) => {
            return `[${timestamp}] || ${message}`;
        })
    ),
    defaultMeta: {
        service: "Northwest Data Sync",
    },
});
