export const mockAnimation = {
  finish: vi.fn(),
  cancel: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  reverse: vi.fn(),
  onfinish: vi.fn(),
  finished: Promise.resolve(),
  startTime: 0,
  currentTime: 0,
  playbackRate: 1,
  effect: null,
};
