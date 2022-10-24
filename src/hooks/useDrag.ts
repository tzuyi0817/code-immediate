import type { DragOffset } from '@/types/drag';

export default function useDrag(dragCallback: (offset: DragOffset) => void) {
  const drag = {
    isStartDrag: false,
    screenWidth: 0,
    screenHeight: 0,
  };

  function startDrag(event: MouseEvent) {
    drag.isStartDrag = true;
    drag.screenWidth = self.screen.width;
    drag.screenHeight = self.screen.height;
    document.addEventListener('mousemove', dragging, false);
    document.addEventListener('mouseup', endDrag, false);
  }

  function dragging(event: MouseEvent) {
    if (!drag.isStartDrag) return;
    const { movementX, movementY } = event;
    const { screenWidth, screenHeight } = drag;

    dragCallback({
      x: movementX / screenWidth,
      y: movementY / screenHeight,
    });
  }

  function endDrag(event: MouseEvent) {
    drag.isStartDrag = false;
    document.removeEventListener('mousemove', dragging, false);
    document.removeEventListener('mouseup', endDrag, false);
  }

  return {
    startDrag,
    dragging,
    endDrag,
  }
}