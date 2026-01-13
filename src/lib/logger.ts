// Production-Ready Logging System for Seera AI
// Structured logging with context, error tracking, and performance monitoring

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    userId?: string;
    requestId?: string;
    path?: string;
    method?: string;
    duration?: number;
    statusCode?: number;
    error?: Error | string;
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    service: string;
    environment: string;
    context?: LogContext;
}

// Log level priority
const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private service: string;
    private minLevel: LogLevel;
    private environment: string;

    constructor(service: string = 'seera-ai') {
        this.service = service;
        this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
        this.environment = process.env.NODE_ENV || 'development';
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
    }

    private formatEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            service: this.service,
            environment: this.environment,
            context,
        };
    }

    private output(entry: LogEntry): void {
        const { level, message, context, timestamp } = entry;

        // In production, output structured JSON for log aggregation
        if (this.environment === 'production') {
            const logLine = JSON.stringify(entry);

            switch (level) {
                case 'error':
                    console.error(logLine);
                    break;
                case 'warn':
                    console.warn(logLine);
                    break;
                default:
                    console.log(logLine);
            }
        } else {
            // In development, output human-readable format
            const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
            const contextStr = context ? ` ${JSON.stringify(context)}` : '';

            switch (level) {
                case 'error':
                    console.error(`${prefix} ${message}${contextStr}`);
                    break;
                case 'warn':
                    console.warn(`${prefix} ${message}${contextStr}`);
                    break;
                case 'debug':
                    console.debug(`${prefix} ${message}${contextStr}`);
                    break;
                default:
                    console.log(`${prefix} ${message}${contextStr}`);
            }
        }
    }

    debug(message: string, context?: LogContext): void {
        if (this.shouldLog('debug')) {
            this.output(this.formatEntry('debug', message, context));
        }
    }

    info(message: string, context?: LogContext): void {
        if (this.shouldLog('info')) {
            this.output(this.formatEntry('info', message, context));
        }
    }

    warn(message: string, context?: LogContext): void {
        if (this.shouldLog('warn')) {
            this.output(this.formatEntry('warn', message, context));
        }
    }

    error(message: string, context?: LogContext): void {
        if (this.shouldLog('error')) {
            // Serialize error object if present
            if (context?.error instanceof Error) {
                context = {
                    ...context,
                    error: {
                        name: context.error.name,
                        message: context.error.message,
                        stack: context.error.stack,
                    },
                };
            }
            this.output(this.formatEntry('error', message, context));
        }
    }

    // Create a child logger with preset context
    child(context: LogContext): ChildLogger {
        return new ChildLogger(this, context);
    }

    // Log API request with timing
    apiRequest(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
        const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        const message = `${method} ${path} ${statusCode} ${duration}ms`;

        this[level](message, {
            method,
            path,
            statusCode,
            duration,
            ...context,
        });
    }

    // Log database query
    dbQuery(operation: string, table: string, duration: number, context?: LogContext): void {
        this.debug(`DB ${operation} on ${table} took ${duration}ms`, {
            operation,
            table,
            duration,
            ...context,
        });
    }

    // Log AI operation
    aiOperation(operation: string, model: string, tokens: number, duration: number, context?: LogContext): void {
        this.info(`AI ${operation} using ${model} (${tokens} tokens, ${duration}ms)`, {
            operation,
            model,
            tokens,
            duration,
            ...context,
        });
    }

    // Log authentication event
    authEvent(event: string, userId?: string, success: boolean = true, context?: LogContext): void {
        const level: LogLevel = success ? 'info' : 'warn';
        this[level](`Auth: ${event}`, {
            userId,
            success,
            ...context,
        });
    }

    // Log payment event
    paymentEvent(event: string, userId: string, amount?: number, context?: LogContext): void {
        this.info(`Payment: ${event}`, {
            userId,
            amount,
            ...context,
        });
    }

    // Performance timer
    startTimer(): () => number {
        const start = performance.now();
        return () => Math.round(performance.now() - start);
    }
}

class ChildLogger {
    private parent: Logger;
    private context: LogContext;

    constructor(parent: Logger, context: LogContext) {
        this.parent = parent;
        this.context = context;
    }

    debug(message: string, context?: LogContext): void {
        this.parent.debug(message, { ...this.context, ...context });
    }

    info(message: string, context?: LogContext): void {
        this.parent.info(message, { ...this.context, ...context });
    }

    warn(message: string, context?: LogContext): void {
        this.parent.warn(message, { ...this.context, ...context });
    }

    error(message: string, context?: LogContext): void {
        this.parent.error(message, { ...this.context, ...context });
    }
}

// Singleton logger instance
export const logger = new Logger();

// Request ID generator
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Error serializer for structured logging
export function serializeError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...(error as any).code && { code: (error as any).code },
        };
    }
    return { message: String(error) };
}

// Audit log helper for critical operations
export interface AuditLogEntry {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

export function logAudit(entry: AuditLogEntry): void {
    logger.info(`AUDIT: ${entry.action} on ${entry.entity}`, {
        ...entry,
        audit: true,
    });
}

export default logger;
