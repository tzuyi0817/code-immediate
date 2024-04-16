export const esModel = 'type="module"';

export const SCRIPT_TYPE_MAP = {
  ES6: '',
  Vue: '',
  VueSFC: esModel,
  React: 'type="text/babel"',
  Angular: '',
  SolidJs: esModel,
  RxJS: esModel,
} as const;
