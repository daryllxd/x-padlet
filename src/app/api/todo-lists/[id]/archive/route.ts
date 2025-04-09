import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Update the todo list status to archived
    const { data, error } = await supabase
      .from('todo_lists')
      .update({ status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error archiving todo list:', error);
      return NextResponse.json({ error: 'Failed to archive todo list' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in archive todo list route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
