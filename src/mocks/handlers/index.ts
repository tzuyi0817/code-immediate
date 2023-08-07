import mockUserApi from '@/mocks/handlers/apis/user';
import mockAlgoliaApi from '@/mocks/handlers/apis/algolia';
import mockCodeApi from '@/mocks/handlers/apis/code';
import mockLocalFile from '@/mocks/handlers/localFile';
 
export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,

  mockAlgoliaApi.search,

  mockCodeApi.getCodes,
  mockCodeApi.postCode,
  mockCodeApi.putCode,
  mockCodeApi.deleteCode,

  ...mockLocalFile,
];
