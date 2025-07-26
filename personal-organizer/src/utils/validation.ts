/**
 * Validation utility functions for the voice-first productivity app
 * Handles form validation, input sanitization, and data validation patterns
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string | undefined;
}

export interface ValidationRule<T = any> {
  validate: (value: T) => ValidationResult;
  message?: string | undefined;
}

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  time24h: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  time12h: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
} as const;

/**
 * Validate required field
 */
export const required = (message = 'This field is required'): ValidationRule<any> => ({
  validate: (value: any): ValidationResult => {
    const isEmpty = value === null || 
                   value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (Array.isArray(value) && value.length === 0);
    
    return {
      isValid: !isEmpty,
      error: isEmpty ? message : undefined,
    };
  },
  message,
});

/**
 * Validate minimum length
 */
export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  validate: (value: string): ValidationResult => {
    const actualMessage = message || `Must be at least ${min} characters long`;
    const isValid = !value || value.length >= min;
    
    return {
      isValid,
      error: isValid ? undefined : actualMessage,
    };
  },
  message,
});

/**
 * Validate maximum length
 */
export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  validate: (value: string): ValidationResult => {
    const actualMessage = message || `Must be no more than ${max} characters long`;
    const isValid = !value || value.length <= max;
    
    return {
      isValid,
      error: isValid ? undefined : actualMessage,
    };
  },
  message,
});

/**
 * Validate email format
 */
export const email = (message = 'Please enter a valid email address'): ValidationRule<string> => ({
  validate: (value: string): ValidationResult => {
    const isValid = !value || VALIDATION_PATTERNS.email.test(value);
    
    return {
      isValid,
      error: isValid ? undefined : message,
    };
  },
  message,
});

/**
 * Validate URL format
 */
export const url = (message = 'Please enter a valid URL'): ValidationRule<string> => ({
  validate: (value: string): ValidationResult => {
    const isValid = !value || VALIDATION_PATTERNS.url.test(value);
    
    return {
      isValid,
      error: isValid ? undefined : message,
    };
  },
  message,
});

/**
 * Validate pattern match
 */
export const pattern = (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
  validate: (value: string): ValidationResult => {
    const isValid = !value || regex.test(value);
    
    return {
      isValid,
      error: isValid ? undefined : message,
    };
  },
  message,
});

/**
 * Validate date format and validity
 */
export const dateValidation = (message = 'Please enter a valid date'): ValidationRule<string | Date> => ({
  validate: (value: string | Date): ValidationResult => {
    if (!value) return { isValid: true };
    
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }
    
    const isValid = !isNaN(date.getTime());
    
    return {
      isValid,
      error: isValid ? undefined : message,
    };
  },
  message,
});

/**
 * Validate future date
 */
export const futureDate = (message = 'Date must be in the future'): ValidationRule<string | Date> => ({
  validate: (value: string | Date): ValidationResult => {
    if (!value) return { isValid: true };
    
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }
    
    const isValid = date.getTime() > Date.now();
    
    return {
      isValid,
      error: isValid ? undefined : message,
    };
  },
  message,
});

/**
 * Validate numeric range
 */
export const numberRange = (
  min?: number, 
  max?: number, 
  message?: string
): ValidationRule<number | string> => ({
  validate: (value: number | string): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return { isValid: true };
    }
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return {
        isValid: false,
        error: 'Must be a valid number',
      };
    }
    
    const minValid = min === undefined || num >= min;
    const maxValid = max === undefined || num <= max;
    
    if (!minValid || !maxValid) {
      const defaultMessage = min !== undefined && max !== undefined
        ? `Must be between ${min} and ${max}`
        : min !== undefined
        ? `Must be at least ${min}`
        : `Must be no more than ${max}`;
      
      return {
        isValid: false,
        error: message || defaultMessage,
      };
    }
    
    return { isValid: true };
  },
  message,
});

/**
 * Validate array length
 */
export const arrayLength = (
  min?: number,
  max?: number,
  message?: string
): ValidationRule<any[]> => ({
  validate: (value: any[]): ValidationResult => {
    if (!value) return { isValid: true };
    
    const length = value.length;
    const minValid = min === undefined || length >= min;
    const maxValid = max === undefined || length <= max;
    
    if (!minValid || !maxValid) {
      const defaultMessage = min !== undefined && max !== undefined
        ? `Must have between ${min} and ${max} items`
        : min !== undefined
        ? `Must have at least ${min} items`
        : `Must have no more than ${max} items`;
      
      return {
        isValid: false,
        error: message || defaultMessage,
      };
    }
    
    return { isValid: true };
  },
  message,
});

/**
 * Combine multiple validation rules
 */
export const combineValidators = <T>(...validators: ValidationRule<T>[]): ValidationRule<T> => ({
  validate: (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator.validate(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  },
});

/**
 * Sanitize HTML input to prevent XSS
 */
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Validate and sanitize task title
 */
export const validateTaskTitle = (title: string): ValidationResult & { sanitized?: string | undefined } => {
  const sanitized = sanitizeString(title);
  
  const validators = combineValidators(
    required('Task title is required'),
    minLength(1, 'Task title cannot be empty'),
    maxLength(200, 'Task title must be less than 200 characters')
  );
  
  const result = validators.validate(sanitized);
  
  return {
    ...result,
    sanitized: result.isValid ? sanitized : undefined,
  };
};

/**
 * Validate and sanitize note content
 */
export const validateNoteContent = (content: string): ValidationResult & { sanitized?: string | undefined } => {
  const sanitized = content.trim();
  
  const validators = combineValidators(
    required('Note content is required'),
    minLength(1, 'Note content cannot be empty'),
    maxLength(10000, 'Note content must be less than 10,000 characters')
  );
  
  const result = validators.validate(sanitized);
  
  return {
    ...result,
    sanitized: result.isValid ? sanitized : undefined,
  };
};

/**
 * Validate tag name
 */
export const validateTag = (tag: string): ValidationResult & { sanitized?: string | undefined } => {
  const sanitized = sanitizeString(tag).toLowerCase();
  
  const validators = combineValidators(
    required('Tag name is required'),
    minLength(1, 'Tag name cannot be empty'),
    maxLength(50, 'Tag name must be less than 50 characters'),
    pattern(VALIDATION_PATTERNS.alphanumericWithSpaces, 'Tag can only contain letters, numbers, and spaces')
  );
  
  const result = validators.validate(sanitized);
  
  return {
    ...result,
    sanitized: result.isValid ? sanitized : undefined,
  };
};

/**
 * Validate event title
 */
export const validateEventTitle = (title: string): ValidationResult & { sanitized?: string | undefined } => {
  const sanitized = sanitizeString(title);
  
  const validators = combineValidators(
    required('Event title is required'),
    minLength(1, 'Event title cannot be empty'),
    maxLength(100, 'Event title must be less than 100 characters')
  );
  
  const result = validators.validate(sanitized);
  
  return {
    ...result,
    sanitized: result.isValid ? sanitized : undefined,
  };
};

/**
 * Validate time format
 */
export const validateTime = (time: string): ValidationResult => {
  const is24h = VALIDATION_PATTERNS.time24h.test(time);
  const is12h = VALIDATION_PATTERNS.time12h.test(time);
  
  return {
    isValid: is24h || is12h,
    error: is24h || is12h ? undefined : 'Please enter a valid time format (e.g., 14:30 or 2:30 PM)',
  };
};

/**
 * Check if a value is empty
 */
export const isEmpty = (value: any): boolean => {
  return value === null || 
         value === undefined || 
         (typeof value === 'string' && value.trim() === '') ||
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};

/**
 * Deep validation for nested objects
 */
export const validateObject = <T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, ValidationRule>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;
  
  for (const [key, validator] of Object.entries(schema)) {
    const result = validator.validate(obj[key]);
    if (!result.isValid) {
      errors[key as keyof T] = result.error;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};
