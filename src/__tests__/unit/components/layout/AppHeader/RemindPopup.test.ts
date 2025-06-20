import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import RemindPopup from '@/components/layout/AppHeader/src/RemindPopup.vue';
import { useFlagStore } from '@/store';
import { registerIcons } from '@/utils/register-icons';

describe('AppHeader/RemindPopup component', () => {
  registerIcons();
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the correct content', () => {
    renderComponent(RemindPopup, {
      props: { modelValue: true, saveCode: () => {}, doFun: () => {} },
    });
    expect(screen.getByRole('heading', { name: /remind/i })).toBeInTheDocument();
    expect(screen.getByTitle('fa-xmark')).toBeInTheDocument();
    expect(screen.getByText(/the current code will be cleared\./i)).toBeInTheDocument();
    expect(screen.getByText(/do you need the system to help you save the project\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('click confirm button', async () => {
    const saveCode = vi.fn();
    const doFun = vi.fn();

    renderComponent(RemindPopup, {
      props: { modelValue: true, saveCode, doFun },
    });
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(saveCode).toHaveBeenCalledTimes(1);
    expect(doFun).toHaveBeenCalledTimes(1);
  });

  it('click cancel button', async () => {
    const flagStore = useFlagStore();
    const doFun = vi.fn();

    renderComponent(RemindPopup, {
      props: { modelValue: true, saveCode: vi.fn(), doFun },
    });
    flagStore.setChangeCodeFlag(true);
    expect(flagStore.isChangeCode).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(flagStore.isChangeCode).toBeFalsy();
  });
});
