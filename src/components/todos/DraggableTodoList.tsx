'use client';

import { socketEvents } from '@/lib/socket';
import { TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';
import { TodoCard } from './TodoCard';

interface DraggableTodoListProps {
  todos: TodoItem[];
  onEdit: (id: string) => void;
}

export function DraggableTodoList({ todos, onEdit }: DraggableTodoListProps) {
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

        socketEvents.reorderTodos(newOrder);
      },
    });
  }, [todos]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {todos.map((todo) => (
        <div key={todo.id} data-todo-id={todo.id}>
          <TodoCard todo={todo} onEdit={onEdit} />
        </div>
      ))}
    </div>
  );
}
