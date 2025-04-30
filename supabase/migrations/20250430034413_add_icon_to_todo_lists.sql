-- Add icon column to todo_lists table
ALTER TABLE todo_lists
ADD COLUMN icon VARCHAR(255) NULL;

-- Add comment to the column
COMMENT ON COLUMN todo_lists.icon IS 'Icon identifier for the todo list';
