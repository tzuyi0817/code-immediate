import { ref } from 'vue';
import { screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import CodeConsole from '@/components/CodeConsole.vue';
import CodePreview from '@/components/CodePreview.vue';
import registerFaIcons from '@/utils/registerFaIcons';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeConsole component', () => {
  registerFaIcons();

  it('renders the correct content', () => {
    renderComponent(CodeConsole, {
      provide: { iframe: ref(null) },
      props: { isShowConsole: true, previewWidth: '66.7vw' },
    });
    expect(screen.getByText('Console')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-angle-down/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('implement command', async () => {
    const iframe = ref(null);

    renderComponent(CodeConsole, {
      provide: { iframe },
      props: { isShowConsole: true, previewWidth: '66.7vw' },
    });
    renderComponent(CodePreview, { provide: { iframe } });
    const commandLine = screen.getByRole('textbox');

    await userEvent.type(commandLine, 'console.log(123)');
    await userEvent.keyboard('{enter}{/enter}');
  });

  describe('receive message', () => {
    it('echo message', async () => {
      renderComponent(CodeConsole, {
        provide: { iframe: ref(null) },
        props: { isShowConsole: true, previewWidth: '66.7vw' },
      });
      fireEvent(
        window,
        new MessageEvent('message', {
          data: { type: 'echo', html: 'echo', message: 'echo' },
          origin: '*',
        }),
      );
      expect(await screen.findByText('echo')).toBeInTheDocument();
    });

    it('log message', async () => {
      renderComponent(CodeConsole, {
        provide: { iframe: ref(null) },
        props: { isShowConsole: true, previewWidth: '66.7vw' },
      });
      fireEvent(
        window,
        new MessageEvent('message', {
          data: { type: 'log', html: '<span class="number">123456789</span>' },
          origin: '*',
        }),
      );
      expect(await screen.findByText('123456789')).toBeInTheDocument();
    });

    it('error message', async () => {
      renderComponent(CodeConsole, {
        provide: { iframe: ref(null) },
        props: { isShowConsole: true, previewWidth: '66.7vw' },
      });
      fireEvent(
        window,
        new MessageEvent('message', {
          data: { type: 'error', html: 'receive error message' },
          origin: '*',
        }),
      );
      expect(await screen.findByText('receive error message')).toBeInTheDocument();
    });

    it('another type message', async () => {
      renderComponent(CodeConsole, {
        provide: { iframe: ref(null) },
        props: { isShowConsole: true, previewWidth: '66.7vw' },
      });
      fireEvent(
        window,
        new MessageEvent('message', {
          data: { type: 'dir', html: 'another message' },
          origin: '*',
        }),
      );
      expect(await screen.findByText('another message')).toBeInTheDocument();
    });

    it('no message for type', () => {
      renderComponent(CodeConsole, {
        provide: { iframe: ref(null) },
        props: { isShowConsole: true, previewWidth: '66.7vw' },
      });
      fireEvent(window, new MessageEvent('message', { data: 'no message', origin: '*' }));
      expect(screen.queryByText('no message')).not.toBeInTheDocument();
    });
  });

  it('clear console message', async () => {
    const html = 'echo-message';

    renderComponent(CodeConsole, {
      provide: { iframe: ref(null) },
      props: { isShowConsole: true, previewWidth: '66.7vw' },
    });
    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'echo', html },
        origin: '*',
      }),
    );
    expect(await screen.findByText(html)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.queryByText(html)).not.toBeInTheDocument();
  });
});
