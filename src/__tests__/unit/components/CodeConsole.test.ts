import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import CodeConsole from '@/components/CodeConsole.vue';
import registerFaIcons from '@/utils/registerFaIcons';
import { useFlagStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeConsole component', () => {
  registerFaIcons();

  it('renders the correct content', () => {
    // renderComponent(CodeConsole, ({
    //   provide: { iframe: null },
    //   props: { isShowConsole: true, previewWidth: '66.7vw' },
    // }));
    // expect(screen.getByText('Console')).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
    // expect(screen.getByRole('img', { name: /fa\-angle\-down/i })).toBeInTheDocument();
    // expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('implement command', async () => {

  });
});
