import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/vue';
import { ref } from 'vue';
import { renderComponent } from '@/__tests__/unit/render';
import { Preview } from '@/components/common';
import Console from '@/components/layout/AppFooter/src/Console.vue';
import { registerIcons } from '@/utils/register-icons';

describe('AppFooter/Console component', () => {
  const renderOptions = {
    provide: { iframe: ref(null) },
    props: { isShowConsole: true, previewWidth: '66.7vw' },
  };

  const sendMessage = async (type: string | undefined, html: string) => {
    const messageEvent = new MessageEvent('message', {
      data: { type, html },
      origin: '*',
    });

    await fireEvent(window, messageEvent);
  };

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(Console, renderOptions);

    expect(screen.getByText('Console')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /fa-angle-down/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('implement command', async () => {
    renderComponent(Console, renderOptions);
    renderComponent(Preview, { provide: renderOptions.provide });

    const commandLine = screen.getByRole('textbox');

    await userEvent.type(commandLine, 'console.log(123)');
    await userEvent.keyboard('{enter}{/enter}');
  });

  describe('receive message', () => {
    it('echo message', async () => {
      renderComponent(Console, renderOptions);

      await sendMessage('echo', 'echo');
      expect(await screen.findByText('echo')).toBeInTheDocument();
    });

    it('log message', async () => {
      renderComponent(Console, renderOptions);

      await sendMessage('log', '<span class="number">123456789</span>');
      expect(await screen.findByText('123456789')).toBeInTheDocument();
    });

    it('warn message', async () => {
      renderComponent(Console, renderOptions);

      const message = 'receive warn message';

      await sendMessage('warn', message);
      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('warn');
    });

    it('error message', async () => {
      renderComponent(Console, renderOptions);

      const message = 'receive error message';

      await sendMessage('error', message);
      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(screen.getAllByRole('alert')[1]).toHaveClass('error');
    });

    it('another type message', async () => {
      renderComponent(Console, renderOptions);

      const message = 'another message';

      await sendMessage('dir', message);
      expect(await screen.findByText(message)).toBeInTheDocument();
    });

    it('no message for type', async () => {
      renderComponent(Console, renderOptions);

      const message = 'no message';

      await sendMessage(undefined, message);
      expect(screen.queryByText('no message')).not.toBeInTheDocument();
    });
  });

  it('clear console message', async () => {
    renderComponent(Console, renderOptions);

    const message = 'echo-message';

    await sendMessage('echo', message);
    expect(await screen.findByText(message)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
