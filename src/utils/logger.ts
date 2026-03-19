import pino from 'pino';
import { config } from '../config/index';

export const logger = pino({
  level: config.logLevel,
  // logs cortos (sin pid/hostname y sin timestamp para reducir tamaño)
  base: null,
  timestamp: false,
  redact: {
    paths: ['req.headers.authorization'],
    remove: true,
  },
});

