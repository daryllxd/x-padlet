import { supabase } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();
    const todoGroupIdsString = formData.get('todo_group_ids');

    if (!todoGroupIdsString || typeof todoGroupIdsString !== 'string') {
      return NextResponse.json(
        { error: 'todo_group_ids JSON string is required' },
        { status: 400 }
      );
    }

    let todoGroupIds: string[];
    try {
      todoGroupIds = JSON.parse(todoGroupIdsString);
      if (!Array.isArray(todoGroupIds)) {
        throw new Error('todo_group_ids must be an array');
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid todo_group_ids format' }, { status: 400 });
    }

    // Update positions one by one since we need to update multiple rows
    const updates = await Promise.all(
      todoGroupIds.map((id, index) =>
        supabase
          .from('todo_groups')
          .update({ position: index + 1 })
          .eq('id', id)
          .select()
          .single()
      )
    );

    // Check for any errors in the updates
    const errors = updates.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Error reordering groups:', errors);
      return NextResponse.json({ error: 'Failed to reorder groups' }, { status: 500 });
    }

    // Return all updated groups
    return NextResponse.json(updates.map((result) => result.data));
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
