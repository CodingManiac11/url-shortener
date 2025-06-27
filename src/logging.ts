// logging.ts
// Reusable logging middleware for the URL Shortener app

export type LogStack = 'frontend' | 'backend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage =
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export async function log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {
  const payload: LogPayload = { stack, level, package: pkg, message };
  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      // Optionally handle logging failure (do not use console.log)
      // Could store in-memory for retry, etc.
    }
  } catch (error) {
    // Optionally handle network error (do not use console.log)
  }
} 