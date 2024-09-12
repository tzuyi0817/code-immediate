import { http, HttpResponse } from 'msw';

export const mockUserApi = {
  loginUser: http.post('*/login', async ({ request }) => {
    const { account, password } = await request.clone().json();
    const isAuthenticated = account === 'FAKE_ACCOUNT' && password === 'FAKE_PASSWORD';

    if (!isAuthenticated) {
      return HttpResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    return HttpResponse.json({
      message: 'login success',
      status: 'success',
      resultMap: {
        user: { account },
        token: password,
      },
    });
  }),
  registerUser: http.post('*/register', async ({ request }) => {
    const { account, password } = await request.clone().json();
    const isAuthenticated = account === 'FAKE_ACCOUNT' && password === 'FAKE_PASSWORD';

    if (!isAuthenticated) {
      return HttpResponse.json({ message: 'account already exists' }, { status: 400 });
    }

    return HttpResponse.json({
      message: 'signup success',
      status: 'success',
      resultMap: {
        user: { account },
        token: password,
      },
    });
  }),
  logoutUser: http.post('*/logout', () => {
    return HttpResponse.json({
      status: 'success',
      message: 'successfully logout',
    });
  }),
};
