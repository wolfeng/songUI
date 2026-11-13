/**
 * Framework-agnostic validation primitives (Vuetify-style rules, SwiftUI-portable).
 * A rule returns `true` when valid, or a descriptive error string when invalid.
 */
export type ValidationRule<T = unknown> = (value: T) => true | string;

export interface FieldValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateField<T>(value: T, rules: ValidationRule<T>[] = []): FieldValidationResult {
  const errors: string[] = [];
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      errors.push(result);
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

export const songRules = {
  required:
    (message = '此项须落墨填具，不可留白'): ValidationRule<unknown> =>
    (value) => {
      if (value === null || value === undefined) return message;
      if (typeof value === 'string' && value.trim().length === 0) return message;
      if (Array.isArray(value) && value.length === 0) return message;
      return true;
    },

  minLength:
    (min: number, message?: string): ValidationRule<string> =>
    (value) => {
      const len = typeof value === 'string' ? value.trim().length : 0;
      return len >= min ? true : message ?? `文辞至少须 ${min} 字`;
    },

  maxLength:
    (max: number, message?: string): ValidationRule<string> =>
    (value) => {
      const len = typeof value === 'string' ? value.length : 0;
      return len <= max ? true : message ?? `文辞至多 ${max} 字`;
    },

  range:
    (min: number, max: number, message?: string): ValidationRule<number> =>
    (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return message ?? '须为有效筹算数值';
      return value >= min && value <= max ? true : message ?? `数值须介于 ${min} 至 ${max} 之间`;
    },

  pattern:
    (regex: RegExp, message = '格式不合程式'): ValidationRule<string> =>
    (value) => {
      if (typeof value !== 'string') return message;
      return regex.test(value) ? true : message;
    }
};
