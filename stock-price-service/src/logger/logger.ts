import { format, createLogger, transports } from 'winston';


const { timestamp, combine, errors, json} = format;

const logLevel: string = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = createLogger({
  format: combine(timestamp(), errors({stack: true}), json()),
  level: logLevel,
  defaultMeta: {service: 'user-service'},
  transports: [new transports.Console()]
});

export default logger;