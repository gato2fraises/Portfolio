/**
 * Système de logging pour le portfolio
 * Remplace console.log pour une meilleure gestion des logs en production
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: any;
}

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    // En développement, autoriser tous les logs
    if (typeof window !== 'undefined' && window.__DEV__) {
      this.currentLevel = LogLevel.DEBUG;
    }
    // En production, limiter aux erreurs importantes
    else {
      this.currentLevel = LogLevel.WARN;
    }
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private addLog(level: LogLevel, message: string, context?: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data
    };

    this.logs.push(entry);

    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // En développement, afficher dans la console
    if (typeof window !== 'undefined' && window.__DEV__ && this.shouldLog(level)) {
      const prefix = context ? `[${context}]` : '';
      const timestamp = entry.timestamp.toISOString().slice(11, 23);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`${timestamp} DEBUG ${prefix} ${message}`, data || '');
          break;
        case LogLevel.INFO:
          console.info(`${timestamp} INFO ${prefix} ${message}`, data || '');
          break;
        case LogLevel.WARN:
          console.warn(`${timestamp} WARN ${prefix} ${message}`, data || '');
          break;
        case LogLevel.ERROR:
          console.error(`${timestamp} ERROR ${prefix} ${message}`, data || '');
          break;
      }
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.ERROR, message, context, data);
  }

  // Performance logging
  performance(label: string, startTime: number, context?: string): void {
    const duration = performance.now() - startTime;
    this.info(`${label}: ${duration.toFixed(2)}ms`, context || 'PERF');
  }

  // Event logging
  event(eventName: string, data?: any, context?: string): void {
    this.info(`Event: ${eventName}`, context || 'EVENT', data);
  }

  // Error with stack trace
  exception(error: Error, context?: string, additionalData?: any): void {
    this.error(`${error.message}`, context || 'EXCEPTION', {
      stack: error.stack,
      name: error.name,
      ...additionalData
    });
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Export logs for support
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Instance globale
export const logger = new Logger();

// Raccourcis pour faciliter l'utilisation
export const log = {
  debug: (message: string, context?: string, data?: any) => logger.debug(message, context, data),
  info: (message: string, context?: string, data?: any) => logger.info(message, context, data),
  warn: (message: string, context?: string, data?: any) => logger.warn(message, context, data),
  error: (message: string, context?: string, data?: any) => logger.error(message, context, data),
  perf: (label: string, startTime: number, context?: string) =>
    logger.performance(label, startTime, context),
  event: (eventName: string, data?: any, context?: string) =>
    logger.event(eventName, data, context),
  exception: (error: Error, context?: string, data?: any) => logger.exception(error, context, data)
};

// Déclaration globale pour utilisation dans le navigateur
declare global {
  interface Window {
    portfolioLogger: Logger;
  }
}

// Exposer le logger globalement en développement
if (typeof window !== 'undefined') {
  window.portfolioLogger = logger;
}

export default logger;
