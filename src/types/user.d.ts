export interface User {
  id: string;
  account: string;
}

export interface LoginPayload {
  account: string;
  password: string;
}

export interface UserResponse {
  token: string;
  user: User;
}

export interface RegisterPayload extends LoginPayload {
  confirmPassword: string;
}
