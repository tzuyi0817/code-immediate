import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/vue';
import { Popup } from '@/components/common';
import { mockAnimation } from '@/test-utils/mocks/animation';
import { renderComponent } from '@/test-utils/render';
import { registerIcons } from '@/utils/register-icons';

describe('Popup component', () => {
  registerIcons();

  it('renders the popup', () => {
    const header = 'Popup Header';
    const content = 'Popup Content';

    renderComponent(Popup, { props: { modelValue: true }, slots: { header, content } });
    expect(screen.getByText(header)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('closes the popup when the close button is clicked', async () => {
    const header = 'Close Header';

    renderComponent(Popup, { props: { modelValue: true }, slots: { header } });
    expect(screen.getByText(header)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('img', { name: /fa-xmark/i }));
    mockAnimation.onfinish();

    await waitFor(() => {
      expect(screen.queryByText(header)).not.toBeInTheDocument();
    });
  });

  it('closes the popup when the overlay is clicked', async () => {
    const header = 'Overlay Header';

    renderComponent(Popup, { props: { modelValue: true }, slots: { header } });
    expect(screen.getByText(header)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('presentation'));
    mockAnimation.onfinish();

    await waitFor(() => {
      expect(screen.queryByText(header)).not.toBeInTheDocument();
    });
  });

  it('does not close the popup when the overlay is clicked and disabledClose is true', async () => {
    const header = 'No Close Header';

    renderComponent(Popup, { props: { modelValue: true, disabledClose: true }, slots: { header } });
    expect(screen.getByText(header)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('presentation'));
    mockAnimation.onfinish();

    expect(screen.getByText(header)).toBeInTheDocument();
  });
});
