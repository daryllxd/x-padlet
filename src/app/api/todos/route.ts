import { supabase } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { TodoFormData, TodoItem } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const todoListId = searchParams.get('todo_list_id');

    let query = supabase.from('todos').select('*').order('position', { ascending: true });

    if (todoListId) {
      query = query.eq('todo_list_id', todoListId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching todos:', error);
      return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }

    return NextResponse.json(data);
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

    const newTodo: Partial<TodoItem> = {
      title: todoFormData.title,
      description: todoFormData.description,
      todo_list_id: todoListId.toString(),
      is_completed: isCompleted,
      theme: todoFormData.theme,
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
