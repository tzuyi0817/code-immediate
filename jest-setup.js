import '@testing-library/jest-dom';
import { mswServer } from '@/__tests__/__mocks__/server';

beforeEach(() => mswServer.listen());
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
