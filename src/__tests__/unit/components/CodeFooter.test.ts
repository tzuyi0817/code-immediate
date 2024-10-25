import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@/utils/register-icons';
import CodeFooter from '@/components/CodeFooter.vue';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeFooter Component', () => {
  const provide = { iframe: null };
  const props = { previewWidth: '33.3vw' };

  registerIcons();

  it('renders the correct content', () => {
    renderComponent(CodeFooter, { provide, props });
    expect(screen.getByRole('button', { name: /console/i })).toBeInTheDocument();
  });

  it('toggle console', async () => {
    renderComponent(CodeFooter, { provide, props });

    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /console/i }));
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });
});
