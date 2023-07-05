import ajax from '@/utils/ajax';

interface LoginPayload {
  account: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}

export function loginUser(data: LoginPayload) {
  return ajax.post('/login', data)
}

export function registerUser(data: RegisterPayload) {
  return ajax.post('/register', data);
}

export function logoutUser() {
  return ajax.post('/logout');
}
