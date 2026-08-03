interface MockAnimation {
  finish: () => void;
  cancel: () => void;
  play: () => void;
  pause: () => void;
  reverse: () => void;
  onfinish: () => void;
  finished: Promise<void>;
  startTime: number;
  currentTime: number;
  playbackRate: number;
  effect: null;
}

export const mockAnimation: MockAnimation = {
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
