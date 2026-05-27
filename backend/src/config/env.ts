/**
 * Environment validation — throws on startup if required variables are missing.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[ENV] Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cortado',
  JWT_SECRET: (() => {
    if (!process.env.JWT_SECRET) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[ENV] JWT_SECRET must be set in production. Refusing to start.');
      }
      console.warn('[ENV] WARNING: JWT_SECRET not set. Using insecure fallback for development only.');
      return 'cortado_dev_secret_do_not_use_in_prod';
    }
    return process.env.JWT_SECRET;
  })(),
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
