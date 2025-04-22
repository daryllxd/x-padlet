'use client';

import { PugletDraggableState, usePugletDraggableState } from '@/lib/puglet-drag';
import { TodoItem } from '@/types';
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import { PugletDragIndicator } from '../puglet-draggable/drag-indicator';

interface DraggableProps {
  todo: TodoItem;
  positionType: 'position' | 'position_in_group';
  allowedEdges?: Exclude<PugletDraggableState['closestEdge'], null>[];
  children: (state: PugletDraggableState) => React.ReactNode;
}

export function DraggableTodo({
  todo,
  positionType,
  allowedEdges = ['left', 'right'],
  children,
}: DraggableProps) {
  const ref = useRef(null);
  const { state, setDragging, setDraggedOver, reset } = usePugletDraggableState();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        type: 'todo',
        position_in_group: todo.position_in_group,
        positionType,
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
          positionType,
          position_in_group: todo.position_in_group,
          type: 'todo',
        };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges,
        });
      },
      onDragEnter: ({ self }) => {
        const closestEdge = extractClosestEdge(self.data);
        if (closestEdge) {
          setDraggedOver(closestEdge);
        }
      },
      onDrop: () => reset(),
      onDragLeave: () => reset(),
    });
  }, [allowedEdges]);

  return (
    <div ref={ref} className="relative h-full">
      {state.closestEdge === 'left' && <PugletDragIndicator direction="left" />}
      {state.closestEdge === 'right' && <PugletDragIndicator direction="right" />}
      {state.closestEdge === 'top' && <PugletDragIndicator direction="top" />}
      {state.closestEdge === 'bottom' && <PugletDragIndicator direction="bottom" />}
      {children(state)}
    </div>
  );
}
