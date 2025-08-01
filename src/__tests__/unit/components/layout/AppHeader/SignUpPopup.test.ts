import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { mockLogout } from '@/__tests__/__mocks__/user';
import { renderComponent } from '@/__tests__/unit/render';
import SignUpPopup from '@/components/layout/AppHeader/src/SignUpPopup.vue';
import { STORAGE_TOKEN, useUserStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/SignUpPopup component', () => {
  const CONFIRM_SECRET_TEXT = 'Confirm Password';

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(SignUpPopup, { props: { modelValue: true } });
    expect(screen.getByRole('heading', { name: /sign up!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(CONFIRM_SECRET_TEXT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    renderComponent(SignUpPopup, { props: { modelValue: true } });
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
    expect(screen.getByLabelText(CONFIRM_SECRET_TEXT)).toBeInvalid();
  });

  it('password must be the same as confirmation password', async () => {
    renderComponent(SignUpPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByLabelText('Account'), 'root');
    await userEvent.type(screen.getByLabelText('Password'), '123');
    await userEvent.type(screen.getByLabelText(CONFIRM_SECRET_TEXT), '1234');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('password and confirmPassword are not the same')).toBeInTheDocument();
  });

  it('signup success', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakeSecret = 'FAKE_PASSWORD';
    const userStore = useUserStore();

    renderComponent(SignUpPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), fakeSecret);
    await userEvent.type(screen.getByLabelText(CONFIRM_SECRET_TEXT), fakeSecret);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem(STORAGE_TOKEN)).toEqual(fakeSecret);
    expect(screen.getByText('signup success')).toBeInTheDocument();
  });

  it('signup error', async () => {
    const account = 'FAKE_ACCOUNT';
    const fakeSecret = 'PASSWORD';
    const userStore = useUserStore();

    mockLogout();
    renderComponent(SignUpPopup, { props: { modelValue: true } });
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), fakeSecret);
    await userEvent.type(screen.getByLabelText(CONFIRM_SECRET_TEXT), fakeSecret);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(userStore.isLogin).toBeFalsy();
    expect(screen.getByText('account already exists')).toBeInTheDocument();
  });
});
