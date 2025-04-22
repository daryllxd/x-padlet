import { withRevalidation } from '@/lib/api/withRevalidation';
import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase.from('todo_lists').select('*').order('position');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const transformedData = data.map((list) => ({
      ...list,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    return NextResponse.json({ error: 'Failed to fetch todo lists' }, { status: 500 });
  }
}

const createTodoList = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description') as string | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data: maxPosition } = await supabase
      .from('todo_lists')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from('todo_lists')
      .insert([
        {
          title,
          description: description || null,
          position: (maxPosition?.position ?? 0) + 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating todo list:', error);
      return NextResponse.json({ error: 'Failed to create todo list' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST = withRevalidation('todo-lists')(createTodoList);
