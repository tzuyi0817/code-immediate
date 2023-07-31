import mockUserApi from '@/mocks/handlers/apis/user';
import mockAlgoliaApi from '@/mocks/handlers/apis/algolia';
import mockCodeApi from '@/mocks/handlers/apis/code';
 
export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,

  mockAlgoliaApi.search,

  mockCodeApi.postCode,
  mockCodeApi.putCode,
];
