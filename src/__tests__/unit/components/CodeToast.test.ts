import { screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { renderComponent } from '@/__tests__/unit/render';
import Toast from '@/components/CodeToast.vue';
import { sleep } from '@/utils/common';
import { toast } from '@/utils/toast';

describe('CodeToast Component', () => {
  it('open toast', async () => {
    const message = 'test success';

    renderComponent(Toast);
    toast.showToast(message, 'success');
    await nextTick();

    const toastMsg = screen.getByText(message);
    const toastDom = screen.getByRole('alert');

    expect(toastMsg).toBeInTheDocument();
    expect(toastDom).toBeInTheDocument();
    expect(toastDom).toHaveClass('toast-show');
  });

  it('close toast', async () => {
    const message = 'test toast';

    renderComponent(Toast);
    toast.showToast(message, 'success');
    await nextTick();

    const toastDom = screen.getByRole('alert');

    toast.closeToast();

    await nextTick();
    expect(toastDom).not.toHaveClass('toast-show');

    await sleep(toast.duration);
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  describe('toast background color', () => {
    const message = 'test toast';

    it('success toast', async () => {
      renderComponent(Toast);
      toast.showToast(message, 'success');
      await nextTick();

      const toastDom = screen.getByRole('alert');

      expect(toastDom).toHaveClass('success');
    });

    it('error toast', async () => {
      renderComponent(Toast);
      toast.showToast(message, 'error');
      await nextTick();

      const toastDom = screen.getByRole('alert');

      expect(toastDom).toHaveClass('error');
    });
  });
});
