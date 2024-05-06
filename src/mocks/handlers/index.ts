import mockUserApi from '@/mocks/handlers/apis/user';
import mockCdnApi from '@/mocks/handlers/apis/cdn';
import mockCodeApi from '@/mocks/handlers/apis/code';
import mockLocalFile from '@/mocks/handlers/localFile';

export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,

  mockCdnApi.search,

  mockCodeApi.getCodes,
  mockCodeApi.postCode,
  mockCodeApi.putCode,
  mockCodeApi.deleteCode,

  ...mockLocalFile,
];
