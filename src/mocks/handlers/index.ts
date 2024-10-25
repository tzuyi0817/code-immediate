import { mockUserApi } from '@/mocks/handlers/apis/user';
import { mockCdnApi } from '@/mocks/handlers/apis/cdn';
import { mockCodeApi } from '@/mocks/handlers/apis/code';
import { mockLocalFiles } from '@/mocks/handlers/local-file';

export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,

  mockCdnApi.search,

  mockCodeApi.getCodes,
  mockCodeApi.postCode,
  mockCodeApi.putCode,
  mockCodeApi.deleteCode,

  ...mockLocalFiles,
];
