import { render, fireEvent, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeHeader from '@/components/CodeHeader.vue';
import Toast from '@/components/Toast.vue';
import { useUserStore, useCodeContentStore, useFlagStore } from '@/store';
import { renderComponent, renderLoadingButton } from '@/__tests__/unit/render';
import { mockLogin, mockLogout } from '@/__tests__/__mocks__/user';

describe('CodeHeader Component', () => {
  registerFaIcons();

  it('renders the correct content', () => {
    renderComponent(CodeHeader);
    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.getByText('Captain Anonymous')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-cloud\-arrow\-up save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-gear settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-centos template/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-file\-circle\-plus new project/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-bars\-staggered/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa\-pen\-fancy/i })).toBeInTheDocument();
  });

  it('show menu list', async () => {
    renderComponent(CodeHeader);
    userEvent.click(screen.getByRole('button', { name: /fa\-bars\-staggered/i }));
    expect(await screen.findByRole('list')).toBeInTheDocument();
  });

  describe('project title', () => {
    it('edit project title', async () => {
      renderComponent(CodeHeader);
      const pen = screen.getByRole('img', { name: /fa\-pen\-fancy/i });
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const value = 'test title';
  
      await userEvent.type(titleInput, value);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    it('edit empty value to display default title', async () => {
      renderComponent(CodeHeader);
      const pen = screen.getByRole('img', { name: /fa\-pen\-fancy/i });
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
      expect(await screen.findByRole('heading', { name: /cdn settings/i })).toBeInTheDocument();
    });

    it('templates popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-centos template/i }));
      expect(await screen.findByRole('heading', { name: /templates/i })).toBeInTheDocument();
    });

    it('sign up popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(await screen.findByRole('heading', { name: /sign up!/i })).toBeInTheDocument();
    });

    it('login popup', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(await screen.findByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    });

    it ('projects popup', async () => {
      mockLogin();
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-sheet\-plastic projects/i }));
      expect(await screen.findByRole('heading', { name: /projects/i} )).toBeInTheDocument();
      mockLogout();
    });

    it('remind popup', async () => {
      useFlagStore().setChangeCodeFlag(true);
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-file\-circle\-plus new project/i }));
      expect(await screen.findByRole('heading', { name: /remind/i })).toBeInTheDocument();
    });
  });

  describe('save code', () => {
    it ('not logged in save code', async () => {
      renderComponent(CodeHeader);
      userEvent.click(screen.getByRole('button', { name: /fa\-cloud\-arrow\-up save/i }));
      expect(await screen.findByText('Log in!')).toBeInTheDocument();
    });

    it('logged in save new code', async () => {
      const codeContentStore = useCodeContentStore();
      const flagStore = useFlagStore();

      mockLogin();
      flagStore.setChangeCodeFlag(true);
      renderComponent(CodeHeader);
      renderComponent(Toast);
      await userEvent.click(screen.getByRole('button', { name: /fa\-cloud\-arrow\-up save/i }));
      expect(codeContentStore.codeId).toEqual('post123');
      expect(flagStore.isChangeCode).toBeFalsy();
      expect(screen.getByText('save code success')).toBeInTheDocument();
    });

    it('logged in update code', async () => {
      const codeContentStore = useCodeContentStore();

      mockLogin();
      codeContentStore.setCodeId('put123');
      renderComponent(CodeHeader);
      renderComponent(Toast);
      await userEvent.click(screen.getByRole('button', { name: /fa\-cloud\-arrow\-up save/i }));
      expect(codeContentStore.codeId).toEqual('put123');
      expect(screen.getByText('update code success')).toBeInTheDocument();
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
