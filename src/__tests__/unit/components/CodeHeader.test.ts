import { render, fireEvent, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeHeader from '@/components/CodeHeader.vue';
import Toast from '@/components/Toast.vue';
import { useUserStore } from '@/store';
import { renderComponent, renderLoadingButton } from '@/__tests__/unit/render';
import { mockLogin } from '@/__tests__/__mocks__/user';

describe('CodeHeader Component', () => {
  registerFaIcons();

  it('renders the correct content', () => {
    renderComponent(CodeHeader);
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText('Captain Anonymous')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByTitle('fa-pen-fancy')).toBeInTheDocument();
    expect(screen.getByTitle('fa-cloud-arrow-up')).toBeInTheDocument();
    expect(screen.getByTitle('fa-gear')).toBeInTheDocument();
    expect(screen.getByTitle('fa-centos')).toBeInTheDocument();
    expect(screen.getByTitle('fa-file-circle-plus')).toBeInTheDocument();
  });

  describe('project title', () => {
    it('edit project title', async () => {
      renderComponent(CodeHeader);
      const pen = screen.getByTitle('fa-pen-fancy');
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const value = 'test title';
  
      await userEvent.type(titleInput, value);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    it('edit empty value to display default title', async () => {
      renderComponent(CodeHeader);
      const pen = screen.getByTitle('fa-pen-fancy');
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const DEFAULT_TITLE = 'Untitled';

      await userEvent.type(titleInput, '{tab}');
      await fireEvent.blur(titleInput);
      expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    });
  });

  describe('correct show popup', () => {
    it('settings popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-gear settings/i }));
      expect(await screen.findByText('CDN Settings')).toBeInTheDocument();
    });

    it('templates popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-centos template/i }));
      expect(await screen.findByText('Templates')).toBeInTheDocument();
    });

    it('sign up popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(await screen.findByText('Sign up!')).toBeInTheDocument();
    });

    it('login popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(await screen.findByText('Log in!')).toBeInTheDocument();
    });
  });

  it('logout test', async () => {
    const { getByText } = render(Toast);
    const userStore = useUserStore();

    renderComponent(CodeHeader);
    renderLoadingButton();
    mockLogin();

    const logoutButton = await screen.findByRole('button', { name: /fa\-arrow\-right\-from\-bracket log out/i });

    expect(logoutButton).toBeInTheDocument();
    await userEvent.click(logoutButton);
    expect(userStore.isLogin).toBeFalsy();
    expect(window.localStorage.getItem('code_token')).toBeNull();
    expect(getByText('successfully logout')).toBeInTheDocument();
  });
});
