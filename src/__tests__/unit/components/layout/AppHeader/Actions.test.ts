import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { mockLogin, mockLogout } from '@/__tests__/__mocks__/user';
import { renderComponent } from '@/__tests__/unit/render';
import AppHeaderActions from '@/components/layout/AppHeader/src/Actions.vue';
import { DEFAULT_TITLE } from '@/constants/common';
import { STORAGE_TOKEN, useCodeContentStore, useFlagStore, useUserStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/Actions Component', () => {
  const props = { defaultTitle: DEFAULT_TITLE, title: DEFAULT_TITLE };

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(AppHeaderActions, { props });

    expect(screen.getByRole('button', { name: /fa-bars-staggered/i })).toBeInTheDocument();
    expect(screen.getByText('ES6')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-cloud-arrow-up/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-gear/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-file-circle-plus/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-github/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('open menu list', async () => {
    renderComponent(AppHeaderActions, { props });

    await userEvent.click(screen.getByRole('button', { name: /fa-bars-staggered/i }));
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  describe('correct show popup', () => {
    it('templates popup', async () => {
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByText('ES6'));
      expect(await screen.findByRole('heading', { name: /templates/i })).toBeInTheDocument();
    });

    it('settings popup', async () => {
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('img', { name: /fa-gear/i }));
      expect(await screen.findByRole('heading', { name: /cdn settings/i })).toBeInTheDocument();
    });

    it('signup popup', async () => {
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('button', { name: /signup/i }));
      expect(await screen.findByRole('heading', { name: /sign up!/i })).toBeInTheDocument();
    });

    it('login popup', async () => {
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('button', { name: /login/i }));
      expect(await screen.findByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    });

    it('projects popup', async () => {
      mockLogin();
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('img', { name: /fa-sheet-plastic/i }));
      expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument();
      mockLogout();
    });

    it('remind popup', async () => {
      useFlagStore().setChangeCodeFlag(true);
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('img', { name: /fa-file-circle-plus/i }));
      expect(await screen.findByRole('heading', { name: /remind/i })).toBeInTheDocument();
    });
  });

  describe('save code', () => {
    it('not logged in save code', async () => {
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('img', { name: /fa-cloud-arrow-up/i }));
      expect(await screen.findByRole('heading', { name: /log in!/i })).toBeInTheDocument();
    });

    it('logged in save new code', async () => {
      const codeContentStore = useCodeContentStore();
      const flagStore = useFlagStore();

      mockLogin();
      flagStore.setChangeCodeFlag(true);
      renderComponent(AppHeaderActions, { props });

      await userEvent.click(screen.getByRole('img', { name: /fa-cloud-arrow-up/i }));
      expect(codeContentStore.codeId).toEqual('post123');
      expect(flagStore.isChangeCode).toBeFalsy();
      expect(screen.getByText('save code success')).toBeInTheDocument();
    });

    it('logged in update code', async () => {
      const codeContentStore = useCodeContentStore();
      const codeId = 'put123';

      mockLogin();
      codeContentStore.setCodeId(codeId);
      renderComponent(AppHeaderActions, { props });
      await userEvent.click(screen.getByRole('img', { name: /fa-cloud-arrow-up/i }));
      expect(codeContentStore.codeId).toEqual(codeId);
      expect(screen.getByText('update code success')).toBeInTheDocument();
    });
  });

  it('share button render and interact', async () => {
    const codeContentStore = useCodeContentStore();
    const codeId = '123';
    const mockedWriteText = vi.fn();

    codeContentStore.setCodeId(codeId);
    renderComponent(AppHeaderActions, { props });

    /* navigator.clipboard.writeText **/
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockedWriteText,
      },
    });
    expect(screen.getByRole('img', { name: /fa-share/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('img', { name: /fa-share/i }));
    expect(mockedWriteText).toHaveBeenCalledTimes(1);
    expect(mockedWriteText).toHaveBeenCalledWith(location.href);
    expect(screen.getByText('Copied URL to clipboard!')).toBeInTheDocument();

    /* document.execCommand **/
    document.execCommand = mockedWriteText;
    await userEvent.click(screen.getByRole('img', { name: /fa-share/i }));
    expect(mockedWriteText).toHaveBeenCalledTimes(2);
    expect(mockedWriteText).toHaveBeenCalledWith('copy');
    expect(screen.getAllByText('Copied URL to clipboard!')).toHaveLength(2);
    vi.resetAllMocks();
  });

  it('link to github', async () => {
    renderComponent(AppHeaderActions, { props });

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/tzuyi0817/code-immediate');
  });

  it('logout', async () => {
    const userStore = useUserStore();

    renderComponent(AppHeaderActions, { props });
    mockLogin();

    const logoutButton = await screen.findByRole('button', { name: /logout/i });

    expect(logoutButton).toBeInTheDocument();
    await userEvent.click(logoutButton);
    expect(userStore.isLogin).toBeFalsy();
    expect(globalThis.localStorage.getItem(STORAGE_TOKEN)).toBeNull();
    expect(screen.getByText('successfully logout')).toBeInTheDocument();
  });
});
