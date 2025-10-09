/**
 * Système de logging pour le portfolio
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
}

/**
 * Logger simple et efficace pour le développement et le debugging
 */
export class Logger {
  private static currentLevel: LogLevel = LogLevel.INFO;
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;

  /**
   * Définit le niveau de log minimum
   */
  static setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Log de niveau DEBUG
   */
  static debug(message: string, ...data: any[]): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log de niveau INFO
   */
  static info(message: string, ...data: any[]): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log de niveau WARN
   */
  static warn(message: string, ...data: any[]): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log de niveau ERROR
   */
  static error(message: string, ...data: any[]): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Méthode interne de logging
   */
  private static log(level: LogLevel, message: string, data: any[]): void {
    if (level < this.currentLevel) return;

    const timestamp = Date.now();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      data: data.length > 0 ? data : undefined
    };

    // Ajouter à l'historique
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Afficher dans la console
    const levelName = LogLevel[level];
    const timeStr = new Date(timestamp).toLocaleTimeString();
    
    const consoleMethod = this.getConsoleMethod(level);
    const prefix = `[${timeStr}] ${levelName}:`;
    
    if (data.length > 0) {
      consoleMethod(prefix, message, ...data);
    } else {
      consoleMethod(prefix, message);
    }
  }

  /**
   * Obtient la méthode console appropriée selon le niveau
   */
  private static getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Obtient tous les logs
   */
  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Efface l'historique des logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Exporte les logs au format JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}