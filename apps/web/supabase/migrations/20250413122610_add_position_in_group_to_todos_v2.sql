-- Add grouped_position column
ALTER TABLE todos ADD COLUMN position_in_group INTEGER;
-- Create a function to backfill grouped_position
CREATE OR REPLACE FUNCTION backfill_grouped_positions()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  group_record RECORD;
  todo_record RECORD;
  position_counter INTEGER;
BEGIN
  -- Loop through each todo_group
  FOR group_record IN SELECT id FROM todo_groups LOOP
    position_counter := 1;
    -- Update todos in this group with sequential positions
    FOR todo_record IN
      SELECT id
      FROM todos
      WHERE todo_group_id = group_record.id
      ORDER BY position
    LOOP
      UPDATE todos
      SET position_in_group = position_counter
      WHERE id = todo_record.id;
      position_counter := position_counter + 1;
    END LOOP;
  END LOOP;
END;
$$;
-- Run the backfill function
SELECT backfill_grouped_positions();
-- Drop the temporary function
DROP FUNCTION backfill_grouped_positions();
-- Add a check constraint to ensure grouped_position is positive
ALTER TABLE todos ADD CONSTRAINT todos_grouped_position_check CHECK (position_in_group > 0);
-- Add an index for better performance when querying by group and position
CREATE INDEX IF NOT EXISTS todos_group_position_idx ON todos(todo_group_id, position_in_group);
