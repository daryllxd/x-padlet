import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch all todo lists from Supabase
    const { data, error } = await supabase
      .from('todo_lists')
      .select('*')
      .not('status', 'eq', 'archived')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    return NextResponse.json({ error: 'Failed to fetch todo lists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const coverImage = formData.get('coverImage') as File | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Insert new todo list using Supabase
    const { data, error } = await supabase
      .from('todo_lists')
      .insert([
        {
          title,
          description: description || null, // Make description optional
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
}
