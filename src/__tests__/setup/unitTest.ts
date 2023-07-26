import '@testing-library/jest-dom';
import { mswServer } from '@/mocks/server';

beforeAll(() => mswServer.listen());
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
