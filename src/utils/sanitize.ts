import DOMPurify from 'dompurify';

/**
 * Sanitizes user input by stripping all HTML tags and XSS vectors.
 * Uses DOMPurify with ALLOWED_TAGS: [] to produce plain-text output only.
 */
export const sanitizeInput = (input: string): string => {
  const cleaned = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  // Extra safety: limit length to prevent prompt injection via huge payloads
  return cleaned.slice(0, 2000);
};

/**
 * Validates that the input is a non-empty string after sanitization.
 */
export const isValidInput = (input: string): boolean => {
  return sanitizeInput(input).length > 0;
};
