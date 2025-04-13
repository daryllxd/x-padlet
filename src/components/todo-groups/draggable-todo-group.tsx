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
