import { vi, expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// @ts-ignore
globalThis.jest = vi;

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

const Notification = {
  requestPermission: vi.fn(() => Promise.resolve('granted')),
  persmission: 'granted',
};

const Audio = vi.fn(() => ({
  play: vi.fn(),
  pause: vi.fn(),
}));

const ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('Notification', Notification);
vi.stubGlobal('Audio', Audio);
vi.stubGlobal('ResizeObserver', ResizeObserver);
