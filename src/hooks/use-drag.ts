import { useFlagStore } from '@/store';
import type { DragOffset } from '@/types/drag';

export function useDrag(dragCallback: (offset: DragOffset) => void) {
  const flagStore = useFlagStore();
  const drag = {
    screenWidth: 0,
    screenHeight: 0,
  };

  function startDrag() {
    flagStore.setDragFlag(true);
    drag.screenWidth = screen.width;
    drag.screenHeight = screen.height;
    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', endDrag);
  }

  function dragging(event: MouseEvent) {
    if (!flagStore.isStartDrag) return;
    const { movementX, movementY } = event;
    const { screenWidth, screenHeight } = drag;

    dragCallback({
      x: movementX / screenWidth,
      y: movementY / screenHeight,
    });
  }

  function endDrag() {
    flagStore.setDragFlag(false);
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', endDrag);
  }

  return {
    startDrag,
    dragging,
    endDrag,
  };
}
