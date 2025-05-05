import { fireEvent, screen, waitFor } from '@testing-library/vue';
import { nextTick } from 'vue';
import { closeAllToast, showToast } from '@/components/common';

describe('Toast Component', () => {
  it('open toast', async () => {
    const message = 'open toast';

    showToast({ message, type: 'success' });
    await nextTick();

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('success');
  });

  it('close toast', async () => {
    const message = 'close toast';
    const duration = 10;
    const { close } = showToast({ message, type: 'success', duration });

    await nextTick();
    const toast = screen.getByText(message);

    close();
    await fireEvent.transitionEnd(toast);

    await waitFor(() => {
      expect(toast).not.toBeInTheDocument();
    });
  });

  describe('other toast type', () => {
    it('error toast', async () => {
      const message = 'error toast';

      showToast({ message, type: 'error' });
      await nextTick();

      expect(screen.getAllByRole('alert')[1]).toHaveClass('error');
    });

    it('warn toast', async () => {
      const message = 'warn toast';

      showToast({ message, type: 'warn' });
      await nextTick();

      expect(screen.getAllByRole('alert')[2]).toHaveClass('warn');
    });
  });

  it('close all toast', async () => {
    const toasts = screen.getAllByRole('alert');

    closeAllToast();
    const closeAll = toasts.map(toast => fireEvent.transitionEnd(toast));

    await Promise.all(closeAll);

    await waitFor(() => {
      expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });
});
