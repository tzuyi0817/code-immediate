import { fireEvent, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import CodeHeader from '@/components/CodeHeader.vue';
import { renderComponent } from '@/__tests__/unit/render';
import { mockLogin } from '@/__tests__/__mocks__/user';
import { DEFAULT_TITLE } from '@/config/common';

describe('CodeHeader Component', () => {
  registerIcons();

  it('renders the correct content', () => {
    renderComponent(CodeHeader);

    expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Captain Anonymous')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-pen-fancy/i })).toBeInTheDocument();
    expect(screen.getByText('ES6')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-cloud-arrow-up/i })).toBeInTheDocument();
  });

  describe('project title', () => {
    it('edit project title', async () => {
      renderComponent(CodeHeader);

      const pen = screen.getByRole('img', { name: /fa-pen-fancy/i });
      await userEvent.click(pen);
      const titleInput = screen.getByRole('textbox');
      const value = 'test title';

      await userEvent.type(titleInput, value);
      await fireEvent.blur(titleInput);
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    it('edit empty value to display default title', async () => {
      renderComponent(CodeHeader);

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
    renderComponent(CodeHeader);
    expect(screen.getByText('root')).toBeInTheDocument();
  });
});
