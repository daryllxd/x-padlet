import { TodoList } from '@/types/todo-list';
import { TodoGroup } from '@/types/todo-group';
import { TodoItem } from '@/types/todo';

/**
 * Template metadata containing UI and behavior configuration
 */
export type TodoListTemplateMetadata = {
  id: string;
  name: string;
  description: string;
  itemSelectionStrategy?: {
    type: 'random';
    count: number;
  };
};

/**
 * Template items grouped by their respective group names
 */
export type TodoListTemplateItems = {
  groupName: string;
  items: Array<Pick<TodoItem, 'title' | 'description' | 'is_completed'>>;
};

/**
 * Complete todo list template structure
 */
export type TodoListTemplate = {
  todoList: Pick<TodoList, 'title' | 'description' | 'display_mode'>;
  todoGroups: Array<Pick<TodoGroup, 'name'>>;
  todoItems: TodoListTemplateItems[];
  metadata: TodoListTemplateMetadata;
};

/**
 * Request type for creating a todo list from a template
 */
export type CreateFromTemplateRequest = {
  templateId: string;
  title?: string;
  description?: string;
};

/**
 * Available template IDs
 */
export const TEMPLATE_IDS = ['bucket-list', 'groceries'] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

/**
 * Type guard to check if a string is a valid template ID
 */
export function isValidTemplateId(id: string): id is TemplateId {
  return TEMPLATE_IDS.includes(id as TemplateId);
}
