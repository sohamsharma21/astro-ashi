// Security utilities for edge functions

// Rate limiting using in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  // Clean up expired entries
  if (record && record.resetAt < now) {
    rateLimitStore.delete(identifier);
  }
  
  const currentRecord = rateLimitStore.get(identifier);
  
  if (!currentRecord) {
    // First request
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs
    };
  }
  
  if (currentRecord.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: currentRecord.resetAt
    };
  }
  
  currentRecord.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - currentRecord.count,
    resetAt: currentRecord.resetAt
  };
}

// Input validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'string' | 'number' | 'email' | 'url';
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function validateInput(
  data: Record<string, any>,
  schema: ValidationSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Required check
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation if not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type check
    if (rules.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${field} must be a valid email`);
      }
    }
    
    if (rules.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        errors.push(`${field} must be a valid URL`);
      }
    }
    
    // Length checks
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`${field} must not exceed ${rules.maxLength} characters`);
    }
    
    // Pattern check
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(`${field} has invalid format`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Structured logging utility
export interface LogContext {
  functionName: string;
  requestId?: string;
  userId?: string;
  [key: string]: any;
}

export class Logger {
  constructor(private context: LogContext) {}
  
  private formatLog(level: string, message: string, data?: any) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data
    });
  }
  
  info(message: string, data?: any) {
    console.log(this.formatLog('INFO', message, data));
  }
  
  warn(message: string, data?: any) {
    console.warn(this.formatLog('WARN', message, data));
  }
  
  error(message: string, error?: any) {
    console.error(this.formatLog('ERROR', message, {
      error: error?.message || error,
      stack: error?.stack
    }));
  }
  
  debug(message: string, data?: any) {
    console.debug(this.formatLog('DEBUG', message, data));
  }
}

// Generate request ID for tracing
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
