import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/vue';
import { mockLogin } from '@/__tests__/__mocks__/user';
import { renderComponent } from '@/__tests__/unit/render';
import { AppHeader } from '@/components/layout';
import { DEFAULT_TITLE } from '@/constants/common';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader Component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(AppHeader);

    expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Captain Anonymous')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-pen-fancy/i })).toBeInTheDocument();
    expect(screen.getByText('ES6')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-cloud-arrow-up/i })).toBeInTheDocument();
  });

  describe('project title', () => {
    it('edit project title', async () => {
      renderComponent(AppHeader);

      const pen = screen.getByRole('img', { name: /fa-pen-fancy/i });
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const value = 'test title';

      await userEvent.type(titleInput, value);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    it('edit empty value to display default title', async () => {
      renderComponent(AppHeader);

      const pen = screen.getByRole('img', { name: /fa-pen-fancy/i });
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');

      await userEvent.clear(titleInput);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    });
  });

  it('show user account when logging in', () => {
    mockLogin();
    renderComponent(AppHeader);
    expect(screen.getByText('root')).toBeInTheDocument();
  });
});
