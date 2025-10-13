// src/lib/logger.ts
const isDev = process.env.NODE_ENV !== 'production';

// In a real app, this might come from environment variables
const IS_DEBUG_MODE = isDev;

// Determine if debug logs should be enabled
const enableDebugLogs = IS_DEBUG_MODE || isDev;

export const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  debug: (...args: any[]) =>
    enableDebugLogs && console.debug('[DEBUG]', ...args),
};
// src/lib/logger.ts
