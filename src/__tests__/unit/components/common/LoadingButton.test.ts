import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import { LoadingButton } from '@/components/common';
import { registerIcons } from '@/utils/register-icons';

describe('LoadingButton component', () => {
  const provide = { iframeRef: null };

  registerIcons();

  it('renders the button', () => {
    renderComponent(LoadingButton, { provide, props: { isLoading: false }, slots: { default: 'submit' } });

    expect(screen.getByText('submit')).toBeInTheDocument();
  });

  it('render the loading status button', () => {
    renderComponent(LoadingButton, { provide, props: { isLoading: true }, slots: { default: 'loading' } });

    expect(screen.getByRole('button')).toHaveAttribute('disabled');
    expect(screen.getByRole('img', { name: /fa-spinner/i })).toBeInTheDocument();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('render the disable status button', () => {
    renderComponent(LoadingButton, { provide, props: { disabled: true }, slots: { default: 'disable' } });

    expect(screen.getByRole('button')).toHaveAttribute('disabled');
    expect(screen.getByText('disable')).toBeInTheDocument();
  });
});
