import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import LoginPopup from '@/components/LoginPopup.vue';
import Toast from '@/components/CodeToast.vue';
import { useUserStore } from '@/store';
import { renderComponent, renderLoadingButton } from '@/__tests__/unit/render';
import { mockLogout } from '@/__tests__/__mocks__/user';

describe('LoginPopup component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(LoginPopup);
    expect(screen.getByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in with github/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    renderComponent(LoginPopup);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  it('login success', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    render(Toast);
    renderComponent(LoginPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem('code_token')).toEqual(fakePassword);
    expect(window.localStorage.getItem('code_account')).toEqual(account);
    expect(screen.getByText('login success')).toBeInTheDocument();
  });

  it('login error', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    render(Toast);
    mockLogout();
    renderComponent(LoginPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(userStore.isLogin).toBeFalsy();
    expect(screen.getByLabelText('Account')).toHaveTextContent('');
    expect(screen.getByLabelText('Password')).toHaveTextContent('');
    expect(screen.getByText('Not authorized')).toBeInTheDocument();
  });

  it('login with github', async () => {
    renderComponent(LoginPopup);

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { screenX, screenLeft, screen: windowScreen, innerHeight } = window;
    const { VITE_API_URL } = import.meta.env;
    const left = (screenX ?? screenLeft ?? 0) + (windowScreen.width - 500) / 2;
    const windowFeatures = `left=${left},top=${innerHeight * 0.5 - 250},width=500,height=500`;

    await userEvent.click(screen.getByRole('button', { name: /log in with github/i }));
    expect(openSpy).toBeCalledWith(`${VITE_API_URL}/github`, 'githubAuth', windowFeatures);
  });
});
