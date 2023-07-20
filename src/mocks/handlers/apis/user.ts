import { rest, type MockedRequest } from 'msw';
import type { LoginPayload, RegisterPayload } from '@/types/user';

const { VITE_API_URL } = import.meta.env;
const mockUserApi = {
  loginUser: rest.post(`${VITE_API_URL}/login`, (req: MockedRequest<LoginPayload>, res, ctx) => {
    const { account, password } = req.body;
    const isAuthenticated = account === 'root' && password === '123456789';

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        message: 'login success',
        resultMap: {
          user: { account },
          token: password,
        },
      }),
    );
  }),
  registerUser: rest.post(`${VITE_API_URL}/register`, (req: MockedRequest<RegisterPayload>, res, ctx) => {
    const { account, password } = req.body;

    return res(
      ctx.status(200),
      ctx.json({
        message: 'signup success',
        resultMap: {
          user: { account },
          token: password,
        },
      }),
    );
  }),
  logoutUser: rest.post(`${VITE_API_URL}/logout`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'successfully logout',
      }),
    );
  }),
};

export default mockUserApi;
