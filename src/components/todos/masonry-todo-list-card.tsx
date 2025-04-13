'use client';

import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { Draggable } from './draggable';
import { TodoCard } from './todo-card';

interface MasonryTodoListCardProps {
  todo: TodoItem;
  listId: string;
}

export function MasonryTodoListCard({ todo, listId }: MasonryTodoListCardProps) {
  return (
    <Draggable todo={todo}>
      {(state) => (
        <TodoCard
          todo={todo}
          listId={listId}
          className={cn(
            state.state === 'dragging' &&
              'border-slate-300 bg-slate-200 opacity-50 [&>*]:opacity-0',
            state.state === 'draggedOver' && 'bg-slate-100'
          )}
        />
      )}
    </Draggable>
  );
}
