import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select('is_completed')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching todo:', fetchError);
      return NextResponse.json({ error: 'Failed to toggle todo' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('todos')
      .update({ is_completed: !currentTodo.is_completed })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling todo:', error);
      return NextResponse.json({ error: 'Failed to toggle todo' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
