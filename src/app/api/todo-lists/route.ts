import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch all todo lists from Supabase
    const { data, error } = await supabase
      .from('contact_form_submissions')
      .select('*')
      .limit(10)
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
    const body = await request.json();
    const { title, description } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Insert new todo list using Supabase
    const { data, error } = await supabase
      .from('todo_lists')
      .insert([{ title, description }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating todo list:', error);
    return NextResponse.json({ error: 'Failed to create todo list' }, { status: 500 });
  }
}
