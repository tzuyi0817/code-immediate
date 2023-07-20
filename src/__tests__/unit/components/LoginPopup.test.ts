import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import LoginPopup from '@/components/LoginPopup.vue';
import Toast from '@/components/Toast.vue';
import { useUserStore } from '@/store';
import { setPinia, renderComponent, renderLoadingButton } from '@/__tests__/unit/render';

describe('LoginPopup component', () => {
  const pinia = setPinia();

  registerFaIcons();
  beforeEach(() => {
    renderComponent(LoginPopup, { pinia });
  });

  it('renders the correct content', () => {
    expect(screen.getByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in with github/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
  });

  it('login test', async () => {
    const account = 'root';
    const password = '123456789';
    const userStore = useUserStore();
    const { getByText } = render(Toast);

    renderLoadingButton();
    await userEvent.type(screen.getByRole('textbox', { name: /account/i }), account);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(userStore.user).toEqual({ account });
    expect(window.localStorage.getItem('code_token')).toEqual(password);
    expect(window.localStorage.getItem('code_account')).toEqual(account);
    expect(getByText('login success')).toBeInTheDocument();
  });
});
