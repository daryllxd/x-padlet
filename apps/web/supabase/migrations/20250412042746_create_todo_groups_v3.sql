-- Create todo_groups table
CREATE TABLE IF NOT EXISTS todo_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    todo_list_id UUID NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    position INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT todo_groups_position_check CHECK (position >= 0)
);

-- Create index on todo_list_id for better performance
CREATE INDEX IF NOT EXISTS todo_groups_todo_list_id_idx ON todo_groups(todo_list_id);

-- Enable Row Level Security
ALTER TABLE todo_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous users to view todo_groups"
ON todo_groups
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to update todo_groups"
ON todo_groups
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert todo_groups"
ON todo_groups
FOR INSERT
TO anon
WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_todo_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todo_groups_updated_at
    BEFORE UPDATE ON todo_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_todo_groups_updated_at();

-- Add todo_group_id to todos table
ALTER TABLE todos
ADD COLUMN todo_group_id UUID REFERENCES todo_groups(id) ON DELETE SET NULL;

-- Create index on todo_group_id for better performance
CREATE INDEX IF NOT EXISTS todos_todo_group_id_idx ON todos(todo_group_id);

-- Create a default todo group for each existing todo_list
INSERT INTO todo_groups (name, todo_list_id, position)
SELECT 'Default Group', id, 0
FROM todo_lists
WHERE NOT EXISTS (
    SELECT 1 FROM todo_groups WHERE todo_groups.todo_list_id = todo_lists.id
);

-- Update existing todos to belong to their respective default groups
UPDATE todos t
SET todo_group_id = g.id
FROM todo_groups g
WHERE t.todo_list_id = g.todo_list_id
AND t.todo_group_id IS NULL;

-- Add constraint to ensure each todo_list has at least one todo_group
CREATE OR REPLACE FUNCTION ensure_todo_list_has_group()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM todo_groups WHERE todo_list_id = NEW.todo_list_id
    ) THEN
        -- Create the default group
        INSERT INTO todo_groups (name, todo_list_id, position)
        VALUES ('Default Group', NEW.todo_list_id, 0)
        RETURNING id INTO NEW.default_group_id;

        -- Update any existing todos for this list to belong to the default group
        UPDATE todos
        SET todo_group_id = NEW.default_group_id
        WHERE todo_list_id = NEW.todo_list_id
        AND todo_group_id IS NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_todo_list_has_group_trigger
    AFTER INSERT ON todo_lists
    FOR EACH ROW
    EXECUTE FUNCTION ensure_todo_list_has_group(); 