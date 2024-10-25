import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import RemindPopup from '@/components/RemindPopup.vue';
import { useFlagStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('RemindPopup component', () => {
  registerIcons();
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the correct content', () => {
    renderComponent(RemindPopup, {
      props: { saveCode: () => {}, doFun: () => {} },
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
      props: { saveCode, doFun },
    });
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(saveCode).toHaveBeenCalledTimes(1);
    expect(doFun).toHaveBeenCalledTimes(1);
  });

  it('click cancel button', async () => {
    const flagStore = useFlagStore();
    const doFun = vi.fn();

    renderComponent(RemindPopup, {
      props: { saveCode: vi.fn(), doFun },
    });
    flagStore.setChangeCodeFlag(true);
    expect(flagStore.isChangeCode).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(flagStore.isChangeCode).toBeFalsy();
  });
});
