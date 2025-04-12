import { withRevalidation } from '@/lib/api/withRevalidation';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const getTodoGroups = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('todo_groups')
      .select('*')
      .eq('todo_list_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch todo groups' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

const createTodoGroup = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

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
      .insert([{ name, todo_list_id: id }])
      .select()
      .single();

    if (error) {
      console.error('Supabase create error:', error);
      return NextResponse.json({ error: 'Failed to create todo group' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const GET = withRevalidation<{ id: string }>('todo-groups')(getTodoGroups);
export const POST = withRevalidation<{ id: string }>('todo-groups')(createTodoGroup);
