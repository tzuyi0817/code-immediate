import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import SignUpPopup from '@/components/SignUpPopup.vue';
import Toast from '@/components/CodeToast.vue';
import { useUserStore } from '@/store';
import { renderComponent, renderLoadingButton } from '@/__tests__/unit/render';
import { mockLogout } from '@/__tests__/__mocks__/user';

describe('SignUpPopup component', () => {
  const CONFIRM_PASSWORD_TEXT = 'Confirm Password';

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(SignUpPopup);
    expect(screen.getByRole('heading', { name: /sign up!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(CONFIRM_PASSWORD_TEXT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    renderComponent(SignUpPopup);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
    expect(screen.getByLabelText(CONFIRM_PASSWORD_TEXT)).toBeInvalid();
  });

  it('password must be the same as confirmation password', async () => {
    render(Toast);

    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), 'root');
    await userEvent.type(screen.getByLabelText('Password'), '123');
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), '1234');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('password and confirmPassword are not the same')).toBeInTheDocument();
  });

  it('signup success', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    render(Toast);
    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem('code_token')).toEqual(fakePassword);
    expect(screen.getByText('signup success')).toBeInTheDocument();
  });

  it('signup error', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakePassword = 'PASSWORD';
    const userStore = useUserStore();

    render(Toast);
    mockLogout();
    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), fakePassword);
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), fakePassword);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.isLogin).toBeFalsy();
    expect(screen.getByText('account already exists')).toBeInTheDocument();
  });
});
