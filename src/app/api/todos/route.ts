import { supabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { TodoFormData } from '@/types';
import { TodoItem } from '@/types/todo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const todoListId = searchParams.get('todo_list_id');

    let query = supabase
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
      .order('position', { ascending: true });

    if (todoListId) {
      query = query.eq('todo_list_id', todoListId);
    }

    const { data, error } = await query;

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const todoListId = formData.get('todo_list_id');
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

    const { data: groups, error: groupsError } = await supabase
      .from('todo_groups')
      .select('id')
      .eq('todo_list_id', todoListId)
      .order('created_at', { ascending: true })
      .limit(1);

    if (groupsError) {
      console.error('Error fetching groups:', groupsError);
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }

    const newTodo: Partial<TodoItem> = {
      title: todoFormData.title,
      description: todoFormData.description,
      todo_list_id: todoListId.toString(),
      is_completed: isCompleted,
      theme: todoFormData.theme,
      todo_group_id: groups?.[0]?.id || null,
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

    const { data, error } = await supabase.from('todos').insert([newTodo]).select().single();

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
