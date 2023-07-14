import { nextTick } from 'vue';
import { screen } from '@testing-library/vue';
import Toast from '@/components/Toast.vue';
import toast from "@/utils/toast";
import { renderComponent } from '@/__tests__/render';

describe('Toast Component', () => {
  beforeEach(() => {
    renderComponent(Toast);
  });

  it('open toast', async () => {
    const message = 'test success';

    toast.showToast(message, 'success');
    await nextTick();
    const toastDom = screen.getByText(message);

    expect(toastDom).toBeInTheDocument();
    expect(toastDom).toHaveClass('toast-show');
  });

  it('close toast', async () => {
    const message = 'test toast';

    toast.showToast(message, 'success');
    await nextTick();
    const toastDom = screen.getByText(message);

    toast.closeToast();
    await nextTick();
    expect(toastDom).not.toHaveClass('toast-show');
  });

  describe('toast background color', () => {
    const message = 'test toast';

    it('success toast', async () => {
      toast.showToast(message, 'success');
      await nextTick();
      expect(screen.getByText(message)).toHaveClass('bg-green-600');
    });

    it('error toast', async () => {
      toast.showToast(message, 'error');
      await nextTick();
      expect(screen.getByText(message)).toHaveClass('bg-red-600');
    });
  });
});
