import { ValidationError, NotFoundError } from '../services/JournalEntryService';
import { logger } from './logger';

/**
 * Wrap an API handler with method checks, centralized error handling, and logging
 * @param {Function} handler - actual route handler (req, res) => Promise<void>
 * @param {string[]} allowedMethods - HTTP methods to allow, e.g. ['GET','POST']
 */
export function withHandler(handler, allowedMethods) {
  return async function(req, res) {
    const { method, url } = req;
    if (!allowedMethods.includes(method)) {
      res.setHeader('Allow', allowedMethods);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
    try {
      logger.info(`${method} ${url} - Incoming request`);
      await handler(req, res);
      logger.info(`${method} ${url} - Handled successfully`);
    } catch (err) {
      if (err instanceof ValidationError) {
        logger.error(`${method} ${url} - ValidationError:`, err.message);
        return res.status(400).json({ error: err.message });
      }
      if (err instanceof NotFoundError) {
        logger.error(`${method} ${url} - NotFoundError:`, err.message);
        return res.status(404).json({ error: err.message });
      }
      logger.error(`${method} ${url} - Unhandled Error:`, err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}