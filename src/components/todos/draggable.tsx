'use client';

import { TodoItem } from '@/types';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

export type DraggableState = {
  state: 'idle' | 'dragging' | 'draggedOver';
  closestEdge: 'left' | 'right' | null;
};

interface DraggableProps {
  todo: TodoItem;
  children: (state: DraggableState) => React.ReactNode;
}

function useDraggableState() {
  const [state, setState] = useState<DraggableState>({
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

// Add type guard for edge
function isHorizontalEdge(edge: Edge): edge is 'left' | 'right' {
  return edge === 'left' || edge === 'right';
}

export function Draggable({ todo, children }: DraggableProps) {
  const ref = useRef(null);
  const { state, setDragging, setDraggedOver, reset } = useDraggableState();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
      }),
      onDragStart: () => setDragging(),
      onDrop: () => reset(),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const data = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        });
      },
      onDragEnter: ({ self }) => {
        const closestEdge = extractClosestEdge(self.data);
        if (closestEdge && isHorizontalEdge(closestEdge)) {
          setDraggedOver(closestEdge);
        }
      },
      onDrop: () => reset(),
      onDragLeave: () => reset(),
    });
  }, []);

  return (
    <div ref={ref} className="relative h-full">
      {state.closestEdge === 'left' && (
        <div className="absolute top-[8px] left-[-10px] h-[calc(100%-16px)] w-1 -translate-x-full transform bg-blue-500 opacity-50" />
      )}
      {state.closestEdge === 'right' && (
        <div className="absolute top-[8px] right-[-10px] h-[calc(100%-16px)] w-1 translate-x-full transform bg-blue-500 opacity-50" />
      )}
      {children(state)}
    </div>
  );
}
