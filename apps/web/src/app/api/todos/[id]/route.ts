import { revalidateTodoList } from '@/lib/api/todo-lists/revalidate';
import { supabase } from '@/lib/db';
import { deleteFromS3, uploadToS3 } from '@/lib/s3';
import { TodoFormData } from '@/types';
import { TodoItem } from '@x-padlet/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description');
    const imageFile = formData.get('image') as File | null;
    const todoListId = formData.get('todo_list_id') as string;
    const theme = formData.get('theme') as TodoItem['theme'] | null;
    const removeImage = formData.get('remove_image') === 'true';

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    if (title.toString().length > 255) {
      return NextResponse.json({ error: 'Title must be 255 characters or less' }, { status: 400 });
    }

    if (description.toString().length > 16384) {
      return NextResponse.json(
        { error: 'Description must be 16,384 characters or less' },
        { status: 400 }
      );
    }

    const todoFormData: TodoFormData = {
      title: title.toString(),
      description: description.toString(),
      imageFile: imageFile,
      theme,
    };

    const updates: Partial<TodoItem> = {};

    const { data: currentTodo } = await supabase
      .from('todos')
      .select('image_url')
      .eq('id', id)
      .single();

    if (removeImage && currentTodo?.image_url) {
      try {
        const key = currentTodo.image_url.split('/').pop();
        if (key) {
          await deleteFromS3(`todos/${id}/${key}`);
        }
        updates.image_url = null;
      } catch (error) {
        console.error('Error deleting image from S3:', error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
      }
    } else if (todoFormData.imageFile) {
      try {
        const bytes = await todoFormData.imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = todoFormData.imageFile.name.split('.').pop();
        const key = `todos/${id}/${Date.now()}.${fileExtension}`;

        const imageUrl = await uploadToS3(buffer, key, todoFormData.imageFile.type);

        updates.image_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image to S3:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    updates.title = todoFormData.title;
    updates.description = todoFormData.description;
    updates.theme = todoFormData.theme;

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }

    revalidateTodoList(todoListId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: todo } = await supabase
      .from('todos')
      .select('todo_list_id')
      .eq('id', id)
      .single();

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }

    revalidateTodoList(todo.todo_list_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
