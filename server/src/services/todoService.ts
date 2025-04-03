import { query } from '../config/db';
import { CreateTodoInput, Todo, UpdateTodoInput } from '../types';
import { WontFix } from '../types/wontfix';

export class TodoService {
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    // Get the maximum position and add 1
    const maxPositionResult = await query(
      'SELECT COALESCE(MAX(position), 0) as max_pos FROM todos'
    );
    const nextPosition = (maxPositionResult.rows[0].max_pos || 0) + 1;

    const result = await query(
      `INSERT INTO todos (title, description, completed, position, todo_list_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [input.title, input.description, false, nextPosition, input.todo_list_id]
    );
    return result.rows[0];
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const updates: string[] = [];
    const values: WontFix[] = [];
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

    if (input.completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(input.completed);
      paramCount++;
    }

    if (input.position !== undefined) {
      updates.push(`position = $${paramCount}`);
      values.push(input.position);
      paramCount++;
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE todos 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    const result = await query('DELETE FROM todos WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Toggle todo completion
  async toggleTodo(id: string): Promise<Todo | null> {
    const result = await query(
      `UPDATE todos 
       SET completed = NOT completed
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getAllTodos(): Promise<Todo[]> {
    const result = await query('SELECT * FROM todos ORDER BY position ASC');
    return result.rows;
  }

  async getTodo(id: string): Promise<Todo | null> {
    const result = await query('SELECT * FROM todos WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updatePositions(todoIds: string[]): Promise<Todo[]> {
    const positionCases = todoIds
      .map((id, index) => `WHEN id = '${id}' THEN ${index + 1}`)
      .join(' ');

    const ids = todoIds.map((id) => `'${id}'`).join(',');

    // Must do an update in one go so that result.rows returns the new rows
    const sql = `
      UPDATE todos
      SET position = CASE ${positionCases} END
      WHERE id IN (${ids})
      RETURNING *
    `;

    const result = await query(sql);
    return result.rows;
  }
}
