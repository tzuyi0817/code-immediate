import { post } from '../request';
import type { UserResponse } from '@/types/response';
import type { LoginPayload, RegisterPayload } from '@/types/user';

export function loginUser(data: LoginPayload) {
  return post<UserResponse>('/login', data);
}

export function registerUser(data: RegisterPayload) {
  return post<UserResponse>('/register', data);
}

export function logoutUser() {
  return post('/logout');
}
