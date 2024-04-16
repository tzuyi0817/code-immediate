import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeEditorMenu from '@/components/CodeEditorMenu.vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { sleep } from '@/utils/common';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeEditorMenu Component', async () => {
  const formatText = 'Format Code';

  registerFaIcons();
  vi.mock('@/utils/exportZip', () => ({ default: vi.fn() }));

  it('renders the correct content', async () => {
    renderComponent(CodeEditorMenu, {
      props: { model: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: false, CSS: false, JS: false, VUE: false },
          toggleMenu: () => {},
        },
      },
    });
    expect(screen.getByRole('button', { name: /fa-angle-down/i })).toBeInTheDocument();
  });

  it('show menu', async () => {
    const toggleMenu = vi.fn();

    renderComponent(CodeEditorMenu, {
      props: { model: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: true, CSS: false, JS: false, VUE: false },
          toggleMenu,
        },
      },
    });
    await userEvent.click(screen.getByRole('button', { name: /fa-angle-down/i }));
    expect(toggleMenu).toHaveBeenCalled();
    expect(screen.getByText(formatText)).toBeInTheDocument();
    expect(screen.getByText('Export Zip')).toBeInTheDocument();
    expect(screen.getByText('Embed Local File')).toBeInTheDocument();
  });

  describe('format code', () => {
    it('format success', async () => {
      const toggleMenu = vi.fn();

      renderComponent(CodeEditorMenu, {
        props: { model: 'HTML' },
        provide: {
          codeMenu: {
            isShowMenuMap: { HTML: true },
            toggleMenu,
          },
        },
      });
      window.prettier = {
        format: vi.fn(() => 'Hello World!'),
      };
      await userEvent.click(screen.getByText(formatText));
      expect(toggleMenu).toHaveBeenCalled();
      expect(useCodeContentStore().codeContent.HTML.content).toBe('Hello World!');
      window.prettier = void 0;
    });

    it('format error', async () => {
      renderComponent(CodeEditorMenu, {
        props: { model: 'HTML' },
        provide: {
          codeMenu: {
            isShowMenuMap: { HTML: true },
            toggleMenu: () => {},
          },
        },
      });
      await userEvent.click(screen.getByText(formatText));
      await sleep();
      expect(useFlagStore().loadingType).toBe('Code formatter error');
    });

    it("language isn't supported error", async () => {
      renderComponent(CodeEditorMenu, {
        props: { model: 'Custom' },
        provide: {
          codeMenu: {
            isShowMenuMap: { Custom: true },
            toggleMenu: () => {},
          },
        },
      });
      await userEvent.click(screen.getByText(formatText));
      await sleep();
      expect(useFlagStore().loadingType).toBe("This syntax isn't supported error");
    });
  });

  it('export code', async () => {
    const exportZip = await import('@/utils/exportZip');
    const toggleMenu = vi.fn();

    renderComponent(CodeEditorMenu, {
      props: { model: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: true },
          toggleMenu,
        },
      },
    });
    await userEvent.click(screen.getByText('Export Zip'));
    expect(toggleMenu).toHaveBeenCalled();
    expect(exportZip.default).toHaveBeenCalled();
  });

  it('embed local file', async () => {
    const toggleMenu = vi.fn();

    renderComponent(CodeEditorMenu, {
      props: { model: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: true },
          toggleMenu,
        },
      },
    });
    await userEvent.click(screen.getByText('Embed Local File'));
    expect(toggleMenu).toHaveBeenCalled();
  });
});
