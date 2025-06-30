export interface ITickDirectiveOptions {
  /** Water ripple color */
  color: string;
  /** First appearance of transparency */
  initialOpacity: number;
  /** Transparency at the end */
  finalOpacity: number;
  /** Animated persistent event */
  duration: number;
  /** CSS Animated transition effects */
  easing: string;
  /** Debounce Time */
  delay: number;
  /** Prohibited Water Waves */
  disabled: boolean;
}

export interface ITickPluginOptions extends ITickDirectiveOptions {
  directive: string;
}

export interface ITickDirectiveOptionWithBinding {
  value: ITickDirectiveOptions;
}
