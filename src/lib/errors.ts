import { TmdbError } from "./tmdb";
import { GENERIC_ERROR_MESSAGE, NOT_FOUND_MESSAGE } from "./messages";

/**
 * Logs the real error on the server and returns a message that is safe to show
 * to users (no status codes, env var names or stack details).
 */
export function toPublicError(e: unknown, context: string): { message: string; status: number } {
  console.error(`[${context}]`, e);
  if (e instanceof TmdbError && e.status === 404) {
    return { message: NOT_FOUND_MESSAGE, status: 404 };
  }
  if (e instanceof TmdbError && e.status === 401) {
    console.error(`[${context}] TMDB_API_KEY missing or invalid`);
  }
  return { message: GENERIC_ERROR_MESSAGE, status: 500 };
}
