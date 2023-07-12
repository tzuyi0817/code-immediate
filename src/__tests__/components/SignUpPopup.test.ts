import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import SignUpPopup from '@/components/SignUpPopup.vue';
import Toast from '@/components/Toast.vue';
import { setPinia, renderComponent, renderLoadingButton } from '@/__tests__/render';
import spyAjax from '@/__tests__/__mocks__/ajax';

describe('SignUpPopup component', () => {
  const pinia = setPinia();

  registerFaIcons();
  beforeEach(() => {
    renderComponent(SignUpPopup, { pinia });
  });

  it('renders the correct content', () => {
    expect(screen.getByRole('heading', { name: /sign up!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('form fields should be required', async () => {
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByLabelText('Account')).toBeInvalid();
    expect(screen.getByLabelText('Password')).toBeInvalid();
    expect(screen.getByLabelText('Confirm Password')).toBeInvalid();
  });

  it('password must be the same as confirmation password', async () => {
    const { getByText } = render(Toast);

    renderLoadingButton();
    await userEvent.type(screen.getByLabelText('Account'), 'root');
    await userEvent.type(screen.getByLabelText('Password'), '123');
    await userEvent.type(screen.getByLabelText('Confirm Password'), '1234');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(getByText('password and confirmPassword are not the same')).toBeInTheDocument();
  });

  it('signup test', async () => {
    const account = 'root';
    const password = '123456789';
    const { getByText } = render(Toast);

    renderLoadingButton();
    spyAjax('post').mockResolvedValue({
      status: '200',
      message: 'signup success',
      resultMap: {
        user: account,
        token: password,
      },
    });
    await userEvent.type(screen.getByLabelText('Account'), account);
    await userEvent.type(screen.getByLabelText('Password'), password);
    await userEvent.type(screen.getByLabelText('Confirm Password'), password);
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(window.localStorage.getItem('code_token')).toEqual(password);
    expect(getByText('signup success')).toBeInTheDocument();
  });
});
