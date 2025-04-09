import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const todoIdsString = formData.get('todo_ids');

    if (!todoIdsString || typeof todoIdsString !== 'string') {
      return NextResponse.json({ error: 'todo_ids JSON string is required' }, { status: 400 });
    }

    let todoIds: string[];
    try {
      todoIds = JSON.parse(todoIdsString);
      if (!Array.isArray(todoIds)) {
        throw new Error('todo_ids must be an array');
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid todo_ids format' }, { status: 400 });
    }

    // Update positions one by one since we need to update multiple rows
    const updates = await Promise.all(
      todoIds.map((id, index) =>
        supabase
          .from('todos')
          .update({ position: index + 1 })
          .eq('id', id)
          .select()
          .single()
      )
    );

    // Check for any errors in the updates
    const errors = updates.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Error reordering todos:', errors);
      return NextResponse.json({ error: 'Failed to reorder todos' }, { status: 500 });
    }

    // Return all updated todos
    return NextResponse.json(updates.map((result) => result.data));
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
