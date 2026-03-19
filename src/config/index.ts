import dotenv from 'dotenv';

dotenv.config();

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const databaseUrl =
  process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL ?? undefined;

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  databaseUrl: required('DATABASE_URL_TEST or DATABASE_URL', databaseUrl),
  databaseUrlTest: process.env.DATABASE_URL_TEST,
  jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
  corsOrigin: process.env.CORS_ORIGIN,
  logLevel: process.env.LOG_LEVEL ?? 'info',
};

