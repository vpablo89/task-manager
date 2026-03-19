import pinoHttp from 'pino-http';
import pino from 'pino';
import { logger } from '../utils/logger';

// Middleware Pino/HTTP para registrar requests con logs compactos.
export const requestLogger = pinoHttp({
  logger,
  quietReqLogger: true,
  serializers: {
    // Evita logs gigantes con headers/body; dejamos solo lo esencial.
    req: (req: unknown) => {
      const r = req as { method?: string; url?: string };
      return { method: r.method, url: r.url };
    },
    res: (res: unknown) => {
      const r = res as { statusCode?: number };
      return { statusCode: r.statusCode };
    },
    err: pino.stdSerializers.err,
  },
  customSuccessMessage: (req: unknown, res: unknown, responseTime: number) => {
    const r = req as { method?: string; url?: string };
    const s = res as { statusCode?: number };
    return `${r.method ?? ''} ${r.url ?? ''} ${s.statusCode ?? 0} - ${responseTime}ms`;
  },
  customErrorMessage: (req: unknown, res: unknown, err: unknown) => {
    const r = req as { method?: string; url?: string };
    const s = res as { statusCode?: number };
    const e = err as { type?: string };
    return `${r.method ?? ''} ${r.url ?? ''} ${s.statusCode ?? 0} - ${e.type ?? 'error'}`;
  },
});

