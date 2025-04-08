import fs from 'fs';
import path from 'path';
import { query } from '../config/db';

export interface TodoList {
  id: string;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
}

interface CreateTodoListInput {
  title: string;
  description?: string;
  coverImageFile?: Express.Multer.File;
}

interface UpdateTodoListInput {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
}

export class TodoListService {
  async createTodoList(input: CreateTodoListInput): Promise<TodoList> {
    if (input.coverImageFile) {
      const uploadsDir = path.join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    }

    const result = await query(
      `INSERT INTO todo_lists (title, description, status)
       VALUES ($1, $2, 'active')
       RETURNING *`,
      [input.title, input.description || null]
    );
    return result.rows[0];
  }

  // Update a todo list
  async updateTodoList(id: string, input: UpdateTodoListInput): Promise<TodoList | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (input.title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(input.title);
      paramCount++;
    }

    if (input.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(input.description);
      paramCount++;
    }

    if (input.status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(input.status);
      paramCount++;
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE todo_lists 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Archive a todo list
  async archiveTodoList(id: string): Promise<TodoList | null> {
    const result = await query(
      `UPDATE todo_lists 
       SET status = 'archived'
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Delete a todo list (and all its todos due to CASCADE)
  async deleteTodoList(id: string): Promise<boolean> {
    const result = await query('DELETE FROM todo_lists WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Get all todo lists with todo counts
  async getAllTodoLists(
    status?: 'active' | 'completed' | 'archived'
  ): Promise<(TodoList & { todoCount: number })[]> {
    let queryText = `
      SELECT 
        tl.*,
        COUNT(t.id) as "todoCount"
      FROM todo_lists tl
      LEFT JOIN todos t ON t.todo_list_id = tl.id
    `;

    const queryParams: any[] = [];

    if (status) {
      queryText += ` WHERE tl.status = $1`;
      queryParams.push(status);
    } else {
      // Default to active and completed
      queryText += ` WHERE tl.status IN ('active', 'completed')`;
    }

    queryText += ` GROUP BY tl.id ORDER BY tl.created_at DESC`;

    const result = await query(queryText, queryParams);
    return result.rows;
  }

  // Get a single todo list with todo count
  async getTodoList(id: string): Promise<(TodoList & { todoCount: number }) | null> {
    const result = await query(
      `
      SELECT 
        tl.*,
        COUNT(t.id) as "todoCount"
      FROM todo_lists tl
      LEFT JOIN todos t ON t.todo_list_id = tl.id
      WHERE tl.id = $1
      GROUP BY tl.id
    `,
      [id]
    );
    return result.rows[0] || null;
  }
}
