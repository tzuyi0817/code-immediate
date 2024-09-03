import { screen, fireEvent } from '@testing-library/vue';
import CodeDrag from '@/components/CodeDrag.vue';
import { useFlagStore } from '@/store';
import { renderComponent } from '@/__tests__/unit/render';

describe('CodeDrag component', () => {
  it('renders the correct content', () => {
    renderComponent(CodeDrag, { props: { direction: 'x' } });

    expect(screen.getByTitle('drag')).toBeInTheDocument();
  });

  it('drag col type c next', async () => {
    renderComponent(CodeDrag, {
      props: {
        direction: 'x',
        dragA: '33.3%',
        dragB: '33.3%',
        dragC: '33.3%',
        typeC: 'next',
      },
    });
    const drag = screen.getByTitle('drag');
    const flagStore = useFlagStore();

    await fireEvent.mouseDown(drag);
    expect(flagStore.isStartDrag).toBeTruthy();
    await fireEvent.mouseMove(document, { clientX: 0, clientY: 20 });
    await fireEvent.mouseUp(document, { clientX: 0, clientY: 20 });
    expect(flagStore.isStartDrag).toBeFalsy();
  });

  it('drag col type c previous', async () => {
    renderComponent(CodeDrag, {
      props: {
        direction: 'x',
        dragA: '33.3%',
        dragB: '33.3%',
        dragC: '33.3%',
        typeC: 'previous',
      },
    });
    const drag = screen.getByTitle('drag');
    const flagStore = useFlagStore();

    await fireEvent.mouseDown(drag);
    expect(flagStore.isStartDrag).toBeTruthy();
    await fireEvent.mouseMove(document, { clientX: 0, clientY: 20 });
    await fireEvent.mouseUp(document, { clientX: 0, clientY: 20 });
    expect(flagStore.isStartDrag).toBeFalsy();
  });

  it('drag col', async () => {
    renderComponent(CodeDrag, {
      props: {
        direction: 'x',
        dragA: '30vw',
        dragB: '30vw',
        unit: 'vw',
      },
    });
    const drag = screen.getByTitle('drag');
    const flagStore = useFlagStore();

    await fireEvent.mouseDown(drag);
    expect(flagStore.isStartDrag).toBeTruthy();
    await fireEvent.mouseMove(document, { clientX: 0, clientY: 20 });
    await fireEvent.mouseUp(document, { clientX: 0, clientY: 20 });
    expect(flagStore.isStartDrag).toBeFalsy();
  });

  it('drag row', async () => {
    renderComponent(CodeDrag, {
      props: {
        direction: 'y',
        dragB: '30vh',
        unit: 'vh',
      },
    });
    const drag = screen.getByTitle('drag');
    const flagStore = useFlagStore();

    await fireEvent.mouseDown(drag);
    expect(flagStore.isStartDrag).toBeTruthy();
    await fireEvent.mouseMove(document, { clientX: 0, clientY: 20 });
    await fireEvent.mouseUp(document, { clientX: 0, clientY: 20 });
    expect(flagStore.isStartDrag).toBeFalsy();
  });
});
