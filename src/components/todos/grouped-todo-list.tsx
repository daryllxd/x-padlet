'use client';

import { useTodoGroups } from '@/hooks/useTodoGroups';
import { useTodos } from '@/hooks/useTodos';
import { PugletDraggableState } from '@/lib/puglet-drag/puglet-draggable-state';
import { cn } from '@/lib/utils';
import { TodoGroup, TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect } from 'react';
import { DraggableTodoGroup } from '../todo-groups/draggable-todo-group';
import { GroupedTodoCreate } from './grouped-todo-create';
import { GroupedTodoHead } from './grouped-todo-head';
import { MasonryTodoListCard } from './masonry-todo-list-card';

interface GroupedTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function GroupedTodoList({ todos, listId }: GroupedTodoListProps) {
  const { groups, isLoading, reorderGroups } = useTodoGroups(listId);
  const { reorderGroupTodos } = useTodos(listId);

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
        const todoDropTarget = location.current.dropTargets.find(
          (target) => target.data.type == 'todo'
        ) as unknown as {
          data: { id: string; title: string; type: string; position_in_group: number };
        };

        const groupDropTarget = location.current.dropTargets.find(
          (target) => target.data.type == 'todo-group'
        ) as unknown as {
          data: { id: string; title: string; type: string };
        };

        if (!groupDropTarget) {
          return;
        }

        const sourceId = source.data as unknown as {
          id: string;
          title: string;
          type: string;
          position_in_group: number;
        };

        if (sourceId.type === 'todo-group') {
          const {
            data: { id: groupDropTargetId },
          } = groupDropTarget;

          const [closestEdgeSymbol] = Object.getOwnPropertySymbols(groupDropTarget.data);

          if (sourceId.id === groupDropTargetId) {
            return;
          }

          const currentOrder = groups.filter((t) => t.id !== sourceId.id).map((t) => t.id);

          const newOrder = currentOrder
            .map((x) => {
              if (x === groupDropTargetId) {
                // @ts-expect-error closestEdgeSymbol is a symbol
                if (groupDropTarget.data[closestEdgeSymbol] === 'left') {
                  return [sourceId.id, groupDropTargetId];
                } else {
                  return [groupDropTargetId, sourceId.id];
                }
              }

              return x;
            })
            .flat();

          reorderGroups(newOrder);
        }

        if (sourceId.type === 'todo') {
          if (!todoDropTarget) {
            reorderGroupTodos(groupDropTarget.data.id, { id: sourceId.id, position_in_group: 1 });
          }

          if (todoDropTarget) {
            reorderGroupTodos(groupDropTarget.data.id, {
              id: sourceId.id,
              position_in_group: todoDropTarget.data.position_in_group,
            });
          }
        }
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
            <div
              key={group.id}
              className={cn(
                'w-[320px] space-y-4 border-2 border-transparent px-1',
                'relative rounded-lg',
                state === 'dragging' && 'border-gray-700 opacity-50',
                state === 'draggedOver' && 'opacity-40'
              )}
            >
              <GroupedTodoHead todoListId={listId} group={group} />
              <GroupedTodoCreate todoListId={listId} todoGroupId={group.id} />
              <div className="grid w-full gap-2">
                {groupedTodos[group.id]?.todos
                  .sort((a, b) => a.position_in_group - b.position_in_group)
                  .map((todo) => (
                    <MasonryTodoListCard
                      key={todo.id}
                      listId={listId}
                      todo={todo}
                      positionType="position_in_group"
                    />
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
