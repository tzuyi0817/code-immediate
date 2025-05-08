import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import AppHeaderMenu from '@/components/layout/AppHeader/src/Menu.vue';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/Menu Component', () => {
  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(AppHeaderMenu, { props: { isLogin: false, codeId: '', modelValue: true } });

    expect(screen.getByText(/save/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.queryByText(/projects/i)).not.toBeInTheDocument();
    expect(screen.getByText(/new project/i)).toBeInTheDocument();
    expect(screen.queryByText(/share/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fa-github github/i })).toBeInTheDocument();
  });

  it('renders the correct content when logged in', async () => {
    renderComponent(AppHeaderMenu, { props: { isLogin: true, codeId: '', modelValue: true } });

    expect(screen.getByText(/projects/i)).toBeInTheDocument();
  });

  it('renders the correct content when codeId is provided', async () => {
    renderComponent(AppHeaderMenu, { props: { isLogin: false, codeId: '123', modelValue: true } });

    expect(screen.getByText(/share/i)).toBeInTheDocument();
  });

  it('emits event', async () => {
    const { emitted } = renderComponent(AppHeaderMenu, { props: { isLogin: true, codeId: '123', modelValue: true } });

    await userEvent.click(screen.getByText(/save/i));
    expect(emitted()).toHaveProperty('saveCode');

    await userEvent.click(screen.getByText(/settings/i));
    expect(emitted()).toHaveProperty('toggleSettingsPop');

    await userEvent.click(screen.getByText(/projects/i));
    expect(emitted()).toHaveProperty('toggleProjectsPop');

    await userEvent.click(screen.getByText(/new project/i));
    expect(emitted()).toHaveProperty('createNewProject');

    await userEvent.click(screen.getByText(/share/i));
    expect(emitted()).toHaveProperty('shareLink');
  });

  it('check github link', async () => {
    renderComponent(AppHeaderMenu, { props: { isLogin: false, codeId: '', modelValue: true } });

    const link = screen.getByRole('link', { name: /fa-github github/i });

    expect(link).toHaveAttribute('href', 'https://github.com/tzuyi0817/code-immediate');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
