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
    expect(screen.getByRole('img', { name: 'fa-xmark' })).toBeInTheDocument();
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
    const fakeSecret = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    renderComponent(LoginPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakeSecret);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem(STORAGE_TOKEN)).toEqual(fakeSecret);
    expect(window.localStorage.getItem(STORAGE_ACCOUNT)).toEqual(account);
    expect(screen.getByText('login success')).toBeInTheDocument();
  });

  it('login error', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakeSecret = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    mockLogout();
    renderComponent(LoginPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakeSecret);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(userStore.isLogin).toBeFalsy();
    expect(screen.getByLabelText('Account')).toHaveTextContent('');
    expect(screen.getByLabelText('Password')).toHaveTextContent('');
    expect(screen.getByText('Not authorized')).toBeInTheDocument();
  });

  it('login with github', async () => {
    renderComponent(LoginPopup, { props: { modelValue: true } });

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { VITE_API_URL } = import.meta.env;
    const { screenX, screenY, outerWidth, outerHeight, innerWidth } = window;
    const width = Math.min(500, innerWidth);
    const left = screenX + (outerWidth - width) / 2;
    const top = screenY + (outerHeight - width) / 2;
    const windowFeatures = `width=${width},height=${width},left=${left},top=${top}`;

    await userEvent.click(screen.getByRole('button', { name: /log in with github/i }));
    expect(openSpy).toBeCalledWith(`${VITE_API_URL}/github`, 'github-oauth', windowFeatures);
  });
});
