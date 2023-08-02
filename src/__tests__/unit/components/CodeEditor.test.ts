import { waitFor, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeEditor from '@/components/CodeEditor.vue';
import Toast from '@/components/Toast.vue';
import { useCodeContentStore, useFlagStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeEditor Component', () => {
  registerFaIcons();

  it('renders the correct content', async () => {
    renderComponent(CodeEditor, { props: { model: 'CSS' }});
  });
});