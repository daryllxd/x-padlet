'use client';

import { useReorderTodo } from '@/hooks/todos/useReorderTodo';
import { TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';
import { MasonryTodoListCard } from './masonry-todo-list-card';

interface StreamTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function StreamTodoList({ todos, listId }: StreamTodoListProps) {
  const { reorderTodos } = useReorderTodo(listId);

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
              if (
                // @ts-expect-error closestEdgeSymbol is a symbol
                dropTarget.data[closestEdgeSymbol] === 'left' ||
                // @ts-expect-error closestEdgeSymbol is a symbol
                dropTarget.data[closestEdgeSymbol] === 'top'
              ) {
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
    <div className="mx-auto flex flex-col gap-4 lg:w-[600px]">
      {todos.map((todo) => (
        <MasonryTodoListCard
          key={todo.id}
          listId={listId}
          todo={todo}
          positionType="position"
          allowedEdges={['top', 'bottom']}
        />
      ))}
    </div>
  );
}
