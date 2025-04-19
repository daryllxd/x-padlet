'use client';

import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { DraggableTodo } from './draggable-todo';
import { TodoCard } from './todo-card';

interface MasonryTodoListCardProps {
  todo: TodoItem;
  listId: string;
  positionType: 'position' | 'position_in_group';
}

export function MasonryTodoListCard({ todo, listId, positionType }: MasonryTodoListCardProps) {
  return (
    <DraggableTodo todo={todo} positionType={positionType}>
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
    </DraggableTodo>
  );
}
