import type { ITickPluginOptions } from './types';

export const DEFAULT_PLUGIN_OPTIONS: ITickPluginOptions = {
  directive: 'tick',
  color: 'rgba(255,255,255,0.6)',
  initialOpacity: 0.2,
  finalOpacity: 0.1,
  duration: 300,
  easing: 'ease-out',
  delay: 75,
  disabled: false,
};

export const RIPPLE_COUNT = 'vTickCountInternal';

export const MULTIPLE_NUMBER = 2.05;
