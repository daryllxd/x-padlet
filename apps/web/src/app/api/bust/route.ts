import { supabase } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Revalidate all paths
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');

    // Fetch all active todo list IDs
    const { data: todoLists, error } = await supabase
      .from('todo_lists')
      .select('id')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching todo lists:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch todo lists',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Revalidate each todo list's cache
    for (const list of todoLists) {
      revalidateTag(`todos-${list.id}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully busted caches for ${todoLists.length} active todo lists`,
    });
  } catch (error) {
    console.error('Error busting caches:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to bust caches',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
