import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { mockLogout } from '@/__tests__/__mocks__/user';
import { renderComponent } from '@/__tests__/unit/render';
import LoginPopup from '@/components/layout/AppHeader/src/LoginPopup.vue';
import { STORAGE_ACCOUNT, STORAGE_TOKEN, useUserStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/LoginPopup component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(LoginPopup, { props: { modelValue: true } });
    expect(screen.getByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in with github/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    renderComponent(LoginPopup, { props: { modelValue: true } });
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  it('login success', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    renderComponent(LoginPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem(STORAGE_TOKEN)).toEqual(fakePassword);
    expect(window.localStorage.getItem(STORAGE_ACCOUNT)).toEqual(account);
    expect(screen.getByText('login success')).toBeInTheDocument();
  });

  it('login error', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    mockLogout();
    renderComponent(LoginPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(userStore.isLogin).toBeFalsy();
    expect(screen.getByLabelText('Account')).toHaveTextContent('');
    expect(screen.getByLabelText('Password')).toHaveTextContent('');
    expect(screen.getByText('Not authorized')).toBeInTheDocument();
  });

  it('login with github', async () => {
    renderComponent(LoginPopup, { props: { modelValue: true } });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { screenX, screenLeft, screen: windowScreen, innerHeight } = window;
    const { VITE_API_URL } = import.meta.env;
    const left = (screenX ?? screenLeft ?? 0) + (windowScreen.width - 500) / 2;
    const windowFeatures = `left=${left},top=${innerHeight * 0.5 - 250},width=500,height=500`;

    await userEvent.click(screen.getByRole('button', { name: /log in with github/i }));
    expect(openSpy).toBeCalledWith(`${VITE_API_URL}/github`, 'githubAuth', windowFeatures);
  });
});
