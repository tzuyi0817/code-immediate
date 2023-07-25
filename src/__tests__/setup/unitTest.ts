import '@testing-library/jest-dom';
import { mswServer } from '@/mocks/server';

beforeAll(() => mswServer.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
