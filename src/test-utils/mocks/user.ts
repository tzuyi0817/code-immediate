import { useUserStore } from '@/store';

export function mockLogin() {
  const userStore = useUserStore();

  userStore.setUser({ id: '1', account: 'root' });
  expect(userStore.isLogin).toBeTruthy();
}

export function mockLogout() {
  const userStore = useUserStore();

  userStore.setUser({});
  expect(userStore.isLogin).toBeFalsy();
}
