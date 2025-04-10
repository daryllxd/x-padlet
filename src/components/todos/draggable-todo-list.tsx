'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Masonry } from 'masonic';
import { useEffect } from 'react';
import { TodoCard } from './todo-card';

interface DraggableTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function DraggableTodoList({ todos, listId }: DraggableTodoListProps) {
  const { reorderTodos } = useTodos(listId);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const dropTarget = location.current.dropTargets[0] as unknown as {
          data: { id: string; title: string };
        };

        if (!dropTarget) {
          return;
        }

        const sourceId = source.data as unknown as {
          id: string;
          title: string;
        };
        const dropTargetId = dropTarget.data.id;

        const [closestEdgeSymbol] = Object.getOwnPropertySymbols(dropTarget.data);

        if (sourceId.id === dropTargetId) {
          return;
        }

        const currentOrder = todos.filter((t) => t.id !== sourceId.id).map((t) => t.id);

        const newOrder = currentOrder
          .map((x) => {
            if (x === dropTargetId) {
              // @ts-expect-error closestEdgeSymbol is a symbol
              if (dropTarget.data[closestEdgeSymbol] === 'left') {
                return [sourceId.id, dropTargetId];
              } else {
                return [dropTargetId, sourceId.id];
              }
            }

            return x;
          })
          .flat();

        reorderTodos(newOrder);
      },
    });
  }, [todos]);

  return (
    <Masonry
      items={todos}
      render={({ data }) => <TodoCard listId={listId} todo={data} />}
      columnGutter={16}
      columnWidth={300}
    />
  );
}
