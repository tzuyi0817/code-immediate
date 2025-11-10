import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import { AppFooter } from '@/components/layout';
import { registerIcons } from '@/utils/register-icons';

describe('AppFooter Component', () => {
  const provide = { iframeRef: null };
  const props = { previewWidth: '33.3vw' };

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(AppFooter, { provide, props });
    expect(screen.getByRole('button', { name: /console/i })).toBeInTheDocument();
  });

  it('toggle console', async () => {
    renderComponent(AppFooter, { provide, props });

    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });
});
