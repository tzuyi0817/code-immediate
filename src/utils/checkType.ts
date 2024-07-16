export const isArray = Array.isArray;
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const hasOwn = <T extends object>(obj: T, key: PropertyKey): key is keyof T => Object.hasOwn(obj, key);
