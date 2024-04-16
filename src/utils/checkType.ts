export const isArray = Array.isArray;
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
