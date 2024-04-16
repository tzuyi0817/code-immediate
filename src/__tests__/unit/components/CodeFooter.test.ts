import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeFooter from '@/components/CodeFooter.vue';
import Toast from '@/components/CodeToast.vue';
import { useCodeContentStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeFooter Component', () => {
  registerFaIcons();

  it('renders the correct content', () => {
    renderComponent(CodeFooter, {
      provide: { iframe: null },
      props: { previewWidth: '33.3vw' },
    });
    expect(screen.getByRole('button', { name: /console/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github-link/i })).toBeInTheDocument();
  });

  it('share button render and interact', async () => {
    const codeContentStore = useCodeContentStore();
    const codeId = '123';
    const { getByText } = render(Toast);
    const mockedWriteText = vi.fn();

    codeContentStore.setCodeId(codeId);
    renderComponent(CodeFooter, {
      provide: { iframe: null },
      props: { previewWidth: '33.3vw' },
    });
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
    expect(getByText('Copied URL to clipboard!')).toBeInTheDocument();
    /* document.execCommand **/
    document.execCommand = mockedWriteText;
    await userEvent.click(screen.getByRole('img', { name: /fa-share/i }));
    expect(getByText('Copied URL to clipboard!')).toBeInTheDocument();
    vi.resetAllMocks();
  });

  it('link to github', async () => {
    renderComponent(CodeFooter, {
      provide: { iframe: null },
      props: { previewWidth: '33.3vw' },
    });
    expect(screen.getByRole('link', { name: /github-link/i })).toHaveAttribute(
      'href',
      'https://github.com/tzuyi0817/code-immediate',
    );
  });

  it('toggle console', async () => {
    renderComponent(CodeFooter, {
      provide: { iframe: null },
      props: { previewWidth: '33.3vw' },
    });
    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });
});
