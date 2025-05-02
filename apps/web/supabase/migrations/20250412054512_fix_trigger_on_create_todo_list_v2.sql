-- Drop the existing trigger
DROP TRIGGER IF EXISTS ensure_todo_list_has_group_trigger ON todo_lists;

-- Drop the existing function
DROP FUNCTION IF EXISTS ensure_todo_list_has_group();

-- Create the new function
CREATE OR REPLACE FUNCTION ensure_todo_list_has_group()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM todo_groups WHERE todo_list_id = NEW.id
    ) THEN
        -- Create the default group
        INSERT INTO todo_groups (name, todo_list_id, position)
        VALUES ('Section 1', NEW.id, 1)
        RETURNING id INTO NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the new trigger
CREATE TRIGGER ensure_todo_list_has_group_trigger
    AFTER INSERT ON todo_lists
    FOR EACH ROW
    EXECUTE FUNCTION ensure_todo_list_has_group();