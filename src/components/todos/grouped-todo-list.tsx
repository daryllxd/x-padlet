'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { PugletDraggableState } from '@/lib/puglet-drag/puglet-draggable-state';
import { cn } from '@/lib/utils';
import { TodoGroup, TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';
import { DraggableTodoGroup } from '../todo-groups/draggable-todo-group';
import { GroupedTodoCreate } from './grouped-todo-create';
import { GroupedTodoHead } from './grouped-todo-head';
import { TodoCard } from './todo-card';

interface GroupedTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function GroupedTodoList({ todos, listId }: GroupedTodoListProps) {
  const { groups, isLoading, reorderGroups } = useTodoGroups(listId);

  // Group todos by their group_id
  const groupedTodos = todos.reduce(
    (acc, todo) => {
      const groupId = todo.todo_group_id || 'ungrouped';
      if (!acc[groupId]) {
        acc[groupId] = {
          name: todo.todo_group_name || 'Ungrouped',
          todos: [],
        };
      }
      acc[groupId].todos.push(todo);
      return acc;
    },
    {} as Record<string, { name: string; todos: TodoItem[] }>
  );

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const dropTarget = location.current.dropTargets[0] as unknown as {
          data: { id: string; title: string };
        };

        console.log('source', source);

        console.log('location.current', location.current);

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

        const currentOrder = groups.filter((t) => t.id !== sourceId.id).map((t) => t.id);

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

        reorderGroups(newOrder);
      },
    });
  }, [groups]);

  if (isLoading) {
    return <></>;
  }

  return (
    // Need negative margin to offset the padding, as the drag indicator gets hidden behind the container
    <div className="-ml-4 flex gap-4 overflow-x-auto px-4 pb-4">
      {groups.map((group: TodoGroup) => (
        <DraggableTodoGroup key={group.id} todoGroup={group}>
          {({ state }: PugletDraggableState) => (
            <div key={group.id} className={cn('w-[320px] space-y-4', state === 'dragging')}>
              <GroupedTodoHead todoListId={listId} group={group} />
              <GroupedTodoCreate todoListId={listId} todoGroupId={group.id} />
              <div className="grid w-[320px] gap-2">
                {groupedTodos[group.id]?.todos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} listId={listId} />
                ))}
              </div>
            </div>
          )}
        </DraggableTodoGroup>
      ))}
      <div className="w-[320px] space-y-4">
        <GroupedTodoHead todoListId={listId} isCreate />
      </div>
    </div>
  );
}
