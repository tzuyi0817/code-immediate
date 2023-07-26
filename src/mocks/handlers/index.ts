import mockUserApi from '@/mocks/handlers/apis/user';
import mockAlgoliaApi from '@/mocks/handlers/apis/algolia';
 
export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,

  mockAlgoliaApi.search,
];
