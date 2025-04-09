import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const todoListId = searchParams.get('todo_list_id');

    let query = supabase.from('todos').select('*').order('position', { ascending: true });

    if (todoListId) {
      query = query.eq('todo_list_id', todoListId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching todos:', error);
      return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description') as string | null;
    const todoListId = formData.get('todo_list_id');

    if (!title || !todoListId) {
      return NextResponse.json({ error: 'Title and todo_list_id are required' }, { status: 400 });
    }

    // Get the maximum position for the todo list
    const { data: maxPositionData, error: maxPositionError } = await supabase
      .from('todos')
      .select('position')
      .eq('todo_list_id', todoListId)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    if (maxPositionError && maxPositionError.code !== 'PGRST116') {
      console.error('Error getting max position:', maxPositionError);
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }

    const nextPosition = (maxPositionData?.position || 0) + 1;

    // Insert new todo
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title,
          description: description || null,
          todo_list_id: todoListId,
          position: nextPosition,
          is_completed: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
