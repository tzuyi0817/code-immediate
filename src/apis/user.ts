import ajax from '@/utils/ajax';
import type { LoginPayload, RegisterPayload } from '@/types/user';

export function loginUser(data: LoginPayload) {
  return ajax.post('/login', data);
}

export function registerUser(data: RegisterPayload) {
  return ajax.post('/register', data);
}

export function logoutUser() {
  return ajax.post('/logout');
}
