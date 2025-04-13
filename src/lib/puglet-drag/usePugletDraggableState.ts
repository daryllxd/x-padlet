import { PugletDraggableState } from '@/lib/puglet-drag/puglet-draggable-state';
import { useState } from 'react';

export function usePugletDraggableState() {
  const [state, setState] = useState<PugletDraggableState>({
    state: 'idle',
    closestEdge: null,
  });

  const setDragging = () => {
    setState({ state: 'dragging', closestEdge: null });
  };

  const setDraggedOver = (edge: 'left' | 'right') => {
    setState({ state: 'draggedOver', closestEdge: edge });
  };

  const reset = () => {
    setState({ state: 'idle', closestEdge: null });
  };

  return { state, setDragging, setDraggedOver, reset };
}
