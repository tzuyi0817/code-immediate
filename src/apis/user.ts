import { post } from '@/utils/ajax';
import type { UserResponse, LoginPayload, RegisterPayload } from '@/types/user';

export function loginUser(data: LoginPayload) {
  return post<UserResponse>('/login', data);
}

export function registerUser(data: RegisterPayload) {
  return post<UserResponse>('/register', data);
}

export function logoutUser() {
  return post('/logout');
}
