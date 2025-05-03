'use client';

import { useReorderTodo } from '@/hooks/todos/useReorderTodo';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TodoItem } from '@x-padlet/types';
import { Masonry } from 'masonic';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMount, usePrevious } from 'react-use';
import { MasonryTodoListCard } from './masonry-todo-list-card';
interface MasonryTodoListProps {
  todos: TodoItem[];
  listId: string;
}

export function MasonryTodoList({ todos, listId }: MasonryTodoListProps) {
  const { reorderTodos } = useReorderTodo(listId);

  const [mounted, setMounted] = useState(false);

  useMount(() => {
    setMounted(true);
  });

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

  if (todos && todos.length === 0) {
    return (
      <div className="m-10 flex flex-col items-center justify-center text-slate-500 sm:m-20">
        {/* TODO: Add a better empty state */}
        <Image
          src="/empty-state.png"
          alt="Empty state"
          className="h-[384px] w-[256px] sm:h-[384px] sm:w-[256px]"
          width={256}
          height={384}
        />
        <p className="sr-only mt-4 text-center">Nothing yet here!</p>
      </div>
    );
  }

  return mounted ? (
    <Masonry
      key={gridKeyPostfix}
      items={todos}
      render={({ data }) => (
        <MasonryTodoListCard listId={listId} todo={data} positionType="position" />
      )}
      columnGutter={16}
      columnWidth={300}
    />
  ) : null;
}
