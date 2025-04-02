import { Todo, CreateTodoInput, UpdateTodoInput } from "../types";
import { query } from "../config/db";

export class TodoService {
  // Create a new todo
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const result = await query(
      `INSERT INTO todos (title, description, completed)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.title, input.description, false]
    );
    return result.rows[0];
  }

  // Update a todo
  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
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

    if (input.completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(input.completed);
      paramCount++;
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE todos 
       SET ${updates.join(", ")}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    const result = await query("DELETE FROM todos WHERE id = $1 RETURNING id", [
      id,
    ]);
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

  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    const result = await query("SELECT * FROM todos ORDER BY created_at DESC");
    return result.rows;
  }

  // Get a single todo
  async getTodo(id: string): Promise<Todo | null> {
    const result = await query("SELECT * FROM todos WHERE id = $1", [id]);
    return result.rows[0] || null;
  }
}
