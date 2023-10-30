import { http, HttpResponse } from 'msw';
import type { LoginPayload, RegisterPayload } from '@/types/user';

const mockUserApi = {
  loginUser: http.post('*/login', async ({ request }) => {
    const { account, password } = await request.json() as LoginPayload;
    const isAuthenticated = account === 'root' && password === '123456789';
    
    if (!isAuthenticated) {
      return HttpResponse.json(
        { message: 'Not authorized' },
        { status: 403 },
      );
    }
    return HttpResponse.json({
      message: 'login success',
      resultMap: {
        user: { account },
        token: password,
      },
    });
  }),
  registerUser: http.post('*/register', async ({ request }) => {
    const { account, password } = await request.json() as RegisterPayload;
    const isAuthenticated = account === 'root' && password === '123456789';
    
    if (!isAuthenticated) {
      return HttpResponse.json(
        { message: 'account already exists' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: 'signup success',
      resultMap: {
        user: { account },
        token: password,
      },
    });
  }),
  logoutUser: http.post('*/logout', () => {
    return HttpResponse.json({
      message: 'successfully logout',
    });
  }),
};

export default mockUserApi;
