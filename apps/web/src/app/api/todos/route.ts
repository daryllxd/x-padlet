import { revalidateTodoList } from '@/lib/api/todo-lists/revalidate';
import { lookupTodoList } from '@/lib/api/todoListLookup';
import { supabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { TodoFormData } from '@/types';
import { TodoItem } from '@x-padlet/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const todoListIdOrUrl = searchParams.get('todo_list_id');

    if (!todoListIdOrUrl) {
      return NextResponse.json({ error: 'todo_list_id is required' }, { status: 400 });
    }

    const result = await lookupTodoList({
      id: todoListIdOrUrl,
      select: 'id',
      supabase,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const todoListId = result.data.id;

    // Now fetch todos using the found todo_list_id
    const { data, error } = await supabase
      .from('todos')
      .select(
        `
        *,
        todo_group:todo_groups (
          id,
          name,
          position
        )
      `
      )
      .eq('todo_list_id', todoListId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching todos:', error);
      return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }

    // Transform the data to flatten the todo_group fields
    const transformedData = data.map((todo) => {
      const { todo_group, ...rest } = todo;
      return {
        ...rest,
        todo_group_id: todo_group?.id,
        todo_group_name: todo_group?.name,
        todo_group_position: todo_group?.position,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * @description Create a new todo, push all todos in the list and group down
 * @param request
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const todoListId = formData.get('todo_list_id');
    const todoGroupId = formData.get('todo_group_id');
    const theme = formData.get('theme');
    const isCompleted = formData.get('is_completed') === 'true';
    const imageFile = formData.get('image') as File | null;

    if ((!title && !description) || !todoListId) {
      return NextResponse.json(
        { error: 'Title, description, and todo list ID are required' },
        { status: 400 }
      );
    }

    if (title && title.toString().length > 255) {
      return NextResponse.json({ error: 'Title must be 255 characters or less' }, { status: 400 });
    }

    if (description && description.toString().length > 16384) {
      return NextResponse.json(
        { error: 'Description must be 16,384 characters or less' },
        { status: 400 }
      );
    }

    const todoFormData: TodoFormData = {
      title: title?.toString() ?? '',
      description: description?.toString() ?? '',
      imageFile: imageFile,
      theme: theme as TodoItem['theme'],
    };

    let groupId: string | undefined = todoGroupId?.toString() || undefined;

    // If no group ID was provided, get the first group
    if (!groupId) {
      const { data: groups, error: groupsError } = await supabase
        .from('todo_groups')
        .select('id')
        .eq('todo_list_id', todoListId)
        .order('position', { ascending: true })
        .limit(1);

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
      }

      groupId = groups?.[0]?.id;
    }

    const newTodo: Partial<TodoItem> = {
      title: todoFormData.title,
      description: todoFormData.description,
      todo_list_id: todoListId.toString(),
      is_completed: isCompleted,
      theme: todoFormData.theme,
      todo_group_id: groupId,
      position: 1,
      position_in_group: 1,
    };

    if (todoFormData.imageFile) {
      try {
        const bytes = await todoFormData.imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = todoFormData.imageFile.name.split('.').pop();
        const key = `todos/${Date.now()}.${fileExtension}`;

        const imageUrl = await uploadToS3(buffer, key, todoFormData.imageFile.type);
        newTodo.image_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image to S3:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('id, position')
      .eq('todo_list_id', todoListId)
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('Error fetching todos:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }

    const updatePromises = todos.map((todo, index) =>
      supabase
        .from('todos')
        .update({ position: index + 2 })
        .eq('id', todo.id)
    );

    const { data: groupTodos, error: groupFetchError } = await supabase
      .from('todos')
      .select('id, position_in_group')
      .eq('todo_group_id', groupId)
      .order('position_in_group', { ascending: true });

    if (groupFetchError) {
      console.error('Error fetching group todos:', groupFetchError);
      return NextResponse.json({ error: 'Failed to fetch group todos' }, { status: 500 });
    }

    const updateGroupPromises = groupTodos.map((todo, index) =>
      supabase
        .from('todos')
        .update({ position_in_group: index + 2 })
        .eq('id', todo.id)
    );

    // todo - this is a bit of a hack, we should be able to do this in a single query, and this also should be wrapped in a transaction
    await Promise.all(updatePromises);
    await Promise.all(updateGroupPromises);

    const { data, error } = await supabase.from('todos').insert([newTodo]).select().single();

    if (error) {
      console.error('Error creating todo:', error);
      return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }

    await revalidateTodoList(todoListId.toString());
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
