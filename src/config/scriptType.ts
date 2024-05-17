export const esModel = 'type="module"';

export const SCRIPT_TYPE_MAP = {
  ES6: '',
  Vue: esModel,
  VueSFC: esModel,
  React: esModel,
  Angular: '',
  SolidJs: esModel,
  RxJS: esModel,
} as const;
