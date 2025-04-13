'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from '@/types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Masonry } from 'masonic';
import { useEffect, useMemo, useRef } from 'react';
import { usePrevious } from 'react-use';
import { MasonryTodoListCard } from './masonry-todo-list-card';

interface MasonryTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function MasonryTodoList({ todos, listId }: MasonryTodoListProps) {
  const { reorderTodos } = useTodos(listId);

  /**
   * @description Workaround for Masonry grid re-render when items are deleted
   * @see https://github.com/jaredLunde/masonic/issues/12#issuecomment-2089843741k
   * @summary Tracks item count changes to force grid re-render on deletion
   */
  const itemsCount = todos?.length;
  const prevItemsCount = usePrevious(itemsCount);

  const removesCount = useRef(0);

  const gridKeyPostfix = useMemo(() => {
    if (!itemsCount || !prevItemsCount) return removesCount.current;
    if (itemsCount < prevItemsCount) {
      removesCount.current += 1;
      return removesCount.current;
    }

    return removesCount.current;
  }, [itemsCount, prevItemsCount]);

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
      key={gridKeyPostfix}
      items={todos}
      render={({ data }) => <MasonryTodoListCard listId={listId} todo={data} />}
      columnGutter={16}
      columnWidth={300}
    />
  );
}
