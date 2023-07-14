import mockUserApi from '@/mocks/handlers/apis/user';

export const handlers = [
  mockUserApi.loginUser,
  mockUserApi.logoutUser,
  mockUserApi.registerUser,
];
