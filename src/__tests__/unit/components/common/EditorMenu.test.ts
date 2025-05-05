import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import { EditorMenu } from '@/components/common';
import { useCodeContentStore, useFlagStore } from '@/store';
import { sleep } from '@/utils/common';
import { registerIcons } from '@/utils/register-icons';

describe('EditorMenu Component', async () => {
  const formatText = 'Format Code';

  registerIcons();
  vi.mock('@/utils/export-zip', () => ({ exportZip: vi.fn() }));

  it('renders the correct content', async () => {
    renderComponent(EditorMenu, {
      props: { model: 'HTML' },
    });
    expect(screen.getByRole('button', { name: /fa-angle-down/i })).toBeInTheDocument();
  });

  it('show menu', async () => {
    renderComponent(EditorMenu, {
      props: { model: 'HTML' },
    });
    await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
    expect(screen.getByText(formatText)).toBeInTheDocument();
    expect(screen.getByText('Export Zip')).toBeInTheDocument();
    expect(screen.getByText('Embed Local File')).toBeInTheDocument();
  });

  describe('format code', () => {
    it('format success', async () => {
      renderComponent(EditorMenu, {
        props: { model: 'HTML' },
      });

      window.prettier = {
        format: vi.fn(() => 'Hello World!'),
      };

      await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
      await userEvent.click(screen.getByText(formatText));
      expect(useCodeContentStore().codeContent.HTML.content).toBe('Hello World!');
      window.prettier = void 0;
    });

    it('format error', async () => {
      renderComponent(EditorMenu, {
        props: { model: 'HTML' },
      });

      await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
      await userEvent.click(screen.getByText(formatText));
      await sleep();
      expect(useFlagStore().loadingType).toBe('Code formatter error');
    });

    it("language isn't supported error", async () => {
      renderComponent(EditorMenu, {
        props: { model: 'Custom' },
      });

      await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
      await userEvent.click(screen.getByText(formatText));
      await sleep();
      expect(useFlagStore().loadingType).toBe("This syntax isn't supported error");
    });
  });

  it('export code', async () => {
    const module = await import('@/utils/export-zip');

    renderComponent(EditorMenu, {
      props: { model: 'HTML' },
    });

    await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
    await userEvent.click(screen.getByText('Export Zip'));
    expect(module.exportZip).toHaveBeenCalled();
  });

  it('embed local file', async () => {
    renderComponent(EditorMenu, {
      props: { model: 'HTML' },
    });

    await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
    await userEvent.click(screen.getByText('Embed Local File'));
  });
});
