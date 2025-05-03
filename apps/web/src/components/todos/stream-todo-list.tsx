'use client';

import { useReorderTodo } from '@/hooks/todos/useReorderTodo';
import { cn } from '@/lib/utils';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TodoItem } from '@x-padlet/types';
import { useEffect } from 'react';
import { DraggableTodo } from './draggable-todo';
import { TodoCard } from './todo-card';

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
        <DraggableTodo
          key={todo.id}
          todo={todo}
          positionType="position"
          allowedEdges={['top', 'bottom']}
        >
          {(state) => (
            <TodoCard
              todo={todo}
              listId={listId}
              className={cn(
                'px-2 py-4',
                state.state === 'dragging' &&
                  'border-slate-300 bg-slate-200 opacity-50 [&>*]:opacity-0',
                state.state === 'draggedOver' && 'bg-slate-100'
              )}
            />
          )}
        </DraggableTodo>
      ))}
    </div>
  );
}
