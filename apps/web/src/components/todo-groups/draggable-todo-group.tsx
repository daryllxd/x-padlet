'use client';

import { isHorizontalEdge, PugletDraggableState, usePugletDraggableState } from '@/lib/puglet-drag';
import { TodoGroup } from '@/types';
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

interface DraggableTodoGroupProps {
  todoGroup: TodoGroup;
  children: (state: PugletDraggableState) => React.ReactNode;
}

export function DraggableTodoGroup({ todoGroup, children }: DraggableTodoGroupProps) {
  const ref = useRef(null);
  const { state, setDragging, setDraggedOver, reset } = usePugletDraggableState();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({
        id: todoGroup.id,
        name: todoGroup.name,
        type: 'todo-group',
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
          id: todoGroup.id,
          name: todoGroup.name,
          type: 'todo-group',
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
      {state.closestEdge === 'left' && <PugletDragIndicator direction="left" />}
      {state.closestEdge === 'right' && <PugletDragIndicator direction="right" />}
      {children(state)}
    </div>
  );
}
