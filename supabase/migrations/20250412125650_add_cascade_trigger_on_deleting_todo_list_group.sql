ALTER TABLE todos
DROP CONSTRAINT IF EXISTS todos_todo_group_id_fkey;

ALTER TABLE todos ADD CONSTRAINT todos_todo_group_id_fkey FOREIGN KEY (todo_group_id) REFERENCES todo_groups (id) ON DELETE CASCADE;
