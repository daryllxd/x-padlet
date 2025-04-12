import { withRevalidation } from '@/lib/api/withRevalidation';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const updateTodoGroup = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; groupId: string }> }
) => {
  const { id, groupId } = await params;

  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (name.length > 255) {
      return NextResponse.json({ error: 'Name must be 255 characters or less' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('todo_groups')
      .update({ name })
      .eq('id', groupId)
      .eq('todo_list_id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update todo group' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

const deleteTodoGroup = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; groupId: string }> }
) => {
  const { id, groupId } = await params;

  try {
    const { error } = await supabase
      .from('todo_groups')
      .delete()
      .eq('id', groupId)
      .eq('todo_list_id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: 'Failed to delete todo group' }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PATCH = withRevalidation<{ id: string; groupId: string }>('todo-groups')(
  updateTodoGroup
);
export const DELETE = withRevalidation<{ id: string; groupId: string }>('todo-groups')(
  deleteTodoGroup
);
