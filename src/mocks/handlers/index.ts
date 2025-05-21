import { mockLocalFiles } from './local-file';
import { mockCdnApi } from './modules/cdn';
import { mockCodeApi } from './modules/code';
import { mockUserApi } from './modules/user';

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
