import { screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import registerFaIcons from '@/utils/registerFaIcons';
import CodeEditorAction from '@/components/CodeEditorAction.vue';
import { useCodeContentStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeEditorAction Component', async () => {
  registerFaIcons();

  it('renders the correct content', async () => {
    renderComponent(CodeEditorAction, {
      props: { isShowPreview: true, currentAction: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: false, CSS: false, JS: false, VUE: false },
          toggleMenu: () => {},
        },
      },
    });
    expect(screen.getByRole('button', { name: /html/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /css/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /js/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /result/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa\-angle\-down/i })).toBeInTheDocument();
  });

  it('change to sfc template', async () => {
    useCodeContentStore().setCodeTemplate('VueSFC');
    renderComponent(CodeEditorAction, {
      props: { isShowPreview: true, currentAction: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: false, CSS: false, JS: false, VUE: false },
          toggleMenu: () => {},
        },
      },
    });
    expect(screen.getByRole('button', { name: /vue/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /html/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /css/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /js/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    useCodeContentStore().setCodeTemplate('ES6');
  });

  it('change select action', async () => {
    const { container, emitted } = renderComponent(CodeEditorAction, {
      props: { isShowPreview: true, currentAction: 'HTML' },
      provide: {
        codeMenu: {
          isShowMenuMap: { HTML: false, CSS: false, JS: false, VUE: false },
          toggleMenu: () => {},
        },
      },
    });
    const selectAction = container.firstChild?.firstChild;

    expect(selectAction).toMatchInlineSnapshot(`
      <div
        class="code_editor_action_left"
        data-v-12668b5f=""
      >
        
        <button
          class="btn_select btn_select-active"
          data-v-12668b5f=""
        >
          HTML
        </button>
        <button
          class="btn_select"
          data-v-12668b5f=""
        >
          CSS
        </button>
        <button
          class="btn_select"
          data-v-12668b5f=""
        >
          JS
        </button>
        
        <button
          class="btn_select btn_select-active"
          data-v-12668b5f=""
        >
          Result
        </button>
      </div>
    `);
    await userEvent.click(screen.getByRole('button', { name: /css/i }));
    expect(emitted('update:currentAction')[0]).toEqual(['CSS']);
    await userEvent.click(screen.getByRole('button', { name: /js/i }));
    expect(emitted('update:currentAction')[1]).toEqual(['JS']);
    await userEvent.click(screen.getByRole('button', { name: /html/i }));
    expect(emitted('update:currentAction')[2]).toEqual(['HTML']);
    await userEvent.click(screen.getByRole('button', { name: /result/i }));
    expect(emitted('update:isShowPreview')[0]).toEqual([false]);
  });
});
