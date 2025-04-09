import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch all todo lists from the database
    const result = await query('SELECT * FROM todo_lists ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
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

    // Insert new todo list
    const result = await query(
      'INSERT INTO todo_lists (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating todo list:', error);
    return NextResponse.json({ error: 'Failed to create todo list' }, { status: 500 });
  }
}
