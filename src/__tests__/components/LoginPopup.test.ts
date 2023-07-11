import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/vue';
import { setActivePinia, createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import registerFaIcons from '@/utils/registerFaIcons';
import LoginPopup from '@/components/LoginPopup.vue';
import spyAjax from '@/__tests__/__mocks__/ajax';

describe('LoginPopup component', () => {
  const pinia = createPinia();

  setActivePinia(pinia);
  registerFaIcons();

  beforeEach(() => {
    render(LoginPopup, {
      global: {
        stubs: { FontAwesomeIcon },
        plugins: [pinia],
      }
    })
  });

  it('renders the correct content', () => {
    expect(screen.getByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByLabelText('Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in with github/i })).toBeInTheDocument();
  });

  it ('login test', async () => {
    const account = 'root';
    const password = '123456789';

    spyAjax('post').mockResolvedValue({
      status: '200',
      message: 'login success',
      resultMap: {
        user: account,
        token: password,
      },
    });
    fireEvent.update(screen.getByRole('textbox', { name: /account/i }), account);
    fireEvent.update(screen.getByLabelText('Password'), password);
    await fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(window.localStorage.getItem('code_token')).toEqual(password);
    expect(window.localStorage.getItem('code_account')).toEqual(account);
  });
});
