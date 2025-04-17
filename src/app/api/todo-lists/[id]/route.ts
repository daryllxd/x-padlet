import { withRevalidation } from '@/lib/api/withRevalidation';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const updateTodoList = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');

    if (title && title.toString().length > 255) {
      return NextResponse.json({ error: 'Title must be 255 characters or less' }, { status: 400 });
    }

    if (description && description.toString().length > 255) {
      return NextResponse.json(
        { error: 'Description must be 255 characters or less' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('todo_lists')
      .update({
        title: title?.toString(),
        description: description?.toString(),
        theme: formData.get('theme')?.toString(),
        display_mode: formData.get('display_mode')?.toString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update todo list' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const PATCH = withRevalidation<{ id: string }>('todo-lists')(updateTodoList);
