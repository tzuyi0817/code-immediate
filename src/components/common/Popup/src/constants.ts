/** popup animate keyframe */
export const POPUP_ANIMATION_KEYFRAME = [
  { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0 },
  { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
];

/** popup animate options */
export const POPUP_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  direction: 'normal',
  fill: 'forwards',
};
