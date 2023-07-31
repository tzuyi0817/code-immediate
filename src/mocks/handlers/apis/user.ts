import { rest, type MockedRequest } from 'msw';
import type { LoginPayload, RegisterPayload } from '@/types/user';

const mockUserApi = {
  loginUser: rest.post('*/login', (req: MockedRequest<LoginPayload>, res, ctx) => {
    const { account, password } = req.body;
    const isAuthenticated = account === 'root' && password === '123456789';
    
    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Not authorized',
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
  registerUser: rest.post('*/register', (req: MockedRequest<RegisterPayload>, res, ctx) => {
    const { account, password } = req.body;
    const isAuthenticated = account === 'root' && password === '123456789';
    
    if (!isAuthenticated) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'account already exists',
        }),
      );
    }

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
  logoutUser: rest.post('*/logout', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'successfully logout',
      }),
    );
  }),
};

export default mockUserApi;
