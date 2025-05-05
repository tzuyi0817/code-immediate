import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import FileTabs from '@/pages/home/components/FileTabs/index.vue';
import { registerIcons } from '@/utils/register-icons';

describe('home page FileTabs component', async () => {
  const props = { isShowPreview: true, currentModel: 'HTML' };

  registerIcons();

  it('renders the correct content', async () => {
    renderComponent(FileTabs, { props });

    expect(screen.getByRole('button', { name: /index.html/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /index.css/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /index.js/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /result/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fa-angle-down/i })).toBeInTheDocument();
  });

  it('change to sfc template', async () => {
    renderComponent(FileTabs, { props: { ...props, currentModel: 'VUE' } });

    expect(screen.getByRole('button', { name: /app.vue/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /index.html/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /index.css/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /index.js/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('change editor model', async () => {
    const { emitted } = renderComponent(FileTabs, { props });
    const updateCurrentModel = 'update:currentModel';
    const modelSelectContainer = screen.getByTestId('editor model select');

    expect(modelSelectContainer).toBeInTheDocument();
    expect(modelSelectContainer).toMatchInlineSnapshot(`
      <div
        class="file-tabs-left"
        data-testid="editor model select"
        data-v-12668b5f=""
      >
        
        <button
          class="btn-select btn-select-active"
          data-v-12668b5f=""
        >
          <span
            class="small-screen"
            data-v-12668b5f=""
          >
            HTML
          </span>
          <span
            class="large-screen"
            data-v-12668b5f=""
          >
            index.html
          </span>
        </button>
        <button
          class="btn-select"
          data-v-12668b5f=""
        >
          <span
            class="small-screen"
            data-v-12668b5f=""
          >
            CSS
          </span>
          <span
            class="large-screen"
            data-v-12668b5f=""
          >
            index.css
          </span>
        </button>
        <button
          class="btn-select"
          data-v-12668b5f=""
        >
          <span
            class="small-screen"
            data-v-12668b5f=""
          >
            JS
          </span>
          <span
            class="large-screen"
            data-v-12668b5f=""
          >
            index.js
          </span>
        </button>
        
        <button
          class="btn-select lg:hidden btn-select-active"
          data-v-12668b5f=""
        >
           Result 
        </button>
      </div>
    `);

    await userEvent.click(screen.getByRole('button', { name: /index.css/i }));
    expect(emitted(updateCurrentModel)[0]).toEqual(['CSS']);

    await userEvent.click(screen.getByRole('button', { name: /index.js/i }));
    expect(emitted(updateCurrentModel)[1]).toEqual(['JS']);

    await userEvent.click(screen.getByRole('button', { name: /index.html/i }));
    expect(emitted(updateCurrentModel)[2]).toEqual(['HTML']);

    await userEvent.click(screen.getByRole('button', { name: /result/i }));
    expect(emitted('update:isShowPreview')[0]).toEqual([false]);
  });
});
