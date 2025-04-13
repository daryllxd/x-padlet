'use client';

import { cn } from '@/lib/utils';
import { TodoItem } from '@/types';
import { Draggable } from './draggable';
import { TodoCard } from './todo-card';

interface TodoListGridTodoCardProps {
  todo: TodoItem;
  listId: string;
}

export function TodoListGridTodoCard({ todo, listId }: TodoListGridTodoCardProps) {
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
