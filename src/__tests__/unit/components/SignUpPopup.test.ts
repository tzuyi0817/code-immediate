import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import SignUpPopup from '@/components/SignUpPopup.vue';
import Toast from '@/components/CodeToast.vue';
import { useUserStore } from '@/store';
import { renderComponent, renderLoadingButton } from '@/__tests__/unit/render';
import { mockLogout } from '@/__tests__/__mocks__/user';

describe('SignUpPopup component', () => {
  const CONFIRM_PASSWORD_TEXT = 'Confirm Password';

  registerFaIcons();

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
    const { getByText } = render(Toast);

    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), 'root');
    await userEvent.type(screen.getByLabelText('Password'), '123');
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), '1234');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(getByText('password and confirmPassword are not the same')).toBeInTheDocument();
  });

  it('signup success', async () => {
    const account = 'root';
    const password = '123456789';
    const userStore = useUserStore();
    const { getByText } = render(Toast);

    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), password);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem('code_token')).toEqual(password);
    expect(getByText('signup success')).toBeInTheDocument();
  });

  it('signup error', async () => {
    const account = 'root';
    const password = '12345678';
    const userStore = useUserStore();
    const { getByText } = render(Toast);

    mockLogout();
    renderComponent(SignUpPopup);
    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.type(screen.getByLabelText(CONFIRM_PASSWORD_TEXT), password);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.isLogin).toBeFalsy();
    expect(getByText('account already exists')).toBeInTheDocument();
  });
});
