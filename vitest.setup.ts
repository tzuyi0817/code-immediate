import { cleanup } from '@testing-library/vue';
import ResizeObserver from 'resize-observer-polyfill';
import { mockAnimation } from '@/__tests__/__mocks__/animation';
import { mswServer } from '@/mocks/server';
import '@testing-library/jest-dom';
import 'vitest-canvas-mock';

beforeAll(() => mswServer.listen());

afterEach(() => {
  cleanup();
  mswServer.resetHandlers();
});

afterAll(() => mswServer.close());

globalThis.ResizeObserver = ResizeObserver;

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Element.prototype.animate = vi.fn().mockImplementation(() => mockAnimation);
