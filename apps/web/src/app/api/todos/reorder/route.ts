import { revalidateTodoList } from '@/lib/api/todo-lists/revalidate';
import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type ReorderRequest =
  | { todo_ids: string[]; todo_list_id: string }
  | {
      group_id: string;
      group_todo: { id: string; position_in_group: number };
      todo_list_id: string;
    };

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as ReorderRequest;
    const todoListId = body.todo_list_id;

    if (!todoListId) {
      return NextResponse.json({ error: 'todo_list_id is required' }, { status: 400 });
    }

    // Handle global position reordering
    if ('todo_ids' in body) {
      const { todo_ids } = body;

      if (!Array.isArray(todo_ids)) {
        return NextResponse.json({ error: 'todo_ids must be an array' }, { status: 400 });
      }

      const updates = await Promise.all(
        todo_ids.map((id, index) =>
          supabase
            .from('todos')
            .update({ position: index + 1 })
            .eq('id', id)
            .select()
            .single()
        )
      );

      const errors = updates.filter((result) => result.error);
      if (errors.length > 0) {
        console.error('Error reordering todos:', errors);
        return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 });
      }

      await revalidateTodoList(todoListId);
      return NextResponse.json(updates.map((result) => result.data));
    }

    if ('group_id' in body && 'group_todo' in body) {
      const { group_id, group_todo } = body;

      if (!group_todo.id || typeof group_todo.position_in_group !== 'number') {
        return NextResponse.json(
          { error: 'group_todo must have id and position_in_group' },
          { status: 400 }
        );
      }

      // Get all todos in the group ordered by current position
      const { data: groupTodos, error: fetchError } = await supabase
        .from('todos')
        .select('id, position_in_group')
        .eq('todo_group_id', group_id)
        .order('position_in_group');

      if (fetchError) {
        console.error('Error fetching group todos:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch group todos' }, { status: 500 });
      }

      if (groupTodos.length === 0) {
        const { data: updatedTodo, error: updateError } = await supabase
          .from('todos')
          .update({ position_in_group: 1, todo_group_id: group_id })
          .eq('id', group_todo.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating todo:', updateError);
          return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
        }

        await revalidateTodoList(todoListId);
        return NextResponse.json(updatedTodo);
      }

      // Move the specified todo to position 1 and shift others down
      const updates = await Promise.all([
        // Update the moved todo to position 1
        supabase
          .from('todos')
          .update({ position_in_group: group_todo.position_in_group, todo_group_id: group_id })
          .eq('id', group_todo.id)
          .select()
          .single(),
        // Update all other todos to shift down
        ...groupTodos
          .filter((todo) => todo.id !== group_todo.id)
          .map((todo, index) =>
            supabase
              .from('todos')
              .update({ position_in_group: index + 1 }) // +2 because position 1 is taken
              .eq('id', todo.id)
              .select()
              .single()
          ),
      ]);

      const errors = updates.filter((result) => result.error);
      if (errors.length > 0) {
        console.error('Error reordering group todos:', errors);
        return NextResponse.json({ error: 'Failed to reorder group todos' }, { status: 500 });
      }

      revalidateTodoList(todoListId);
      return NextResponse.json(updates.map((result) => result.data));
    }

    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
