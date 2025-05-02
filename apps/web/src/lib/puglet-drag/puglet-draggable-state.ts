export type PugletDraggableState = {
  state: 'idle' | 'dragging' | 'draggedOver';
  closestEdge: 'left' | 'right' | 'top' | 'bottom' | null;
};
