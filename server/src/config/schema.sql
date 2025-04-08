DROP TRIGGER IF EXISTS update_todo_lists_updated_at ON todo_lists;
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;

-- Then drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create todo_lists table
CREATE TABLE IF NOT EXISTS todo_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT todo_lists_status_check CHECK (status IN ('active', 'completed', 'archived'))
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'todos'
        AND column_name = 'todo_list_id'
    ) THEN
        ALTER TABLE todos ADD COLUMN todo_list_id UUID REFERENCES todo_lists(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_todos_todo_list_id ON todos(todo_list_id);

-- Make todo_list_id NOT NULL after migration
ALTER TABLE todos ALTER COLUMN todo_list_id SET NOT NULL;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_lists_updated_at
    BEFORE UPDATE ON todo_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
    -- First check and add the status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'todo_lists'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE todo_lists ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';
        UPDATE todo_lists SET status = 'active';
    END IF;

    -- Then check and add the constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'todo_lists'
        AND constraint_name = 'todo_lists_status_check'
    ) THEN
        ALTER TABLE todo_lists ADD CONSTRAINT todo_lists_status_check 
            CHECK (status IN ('active', 'completed', 'archived'));
    END IF;
END $$;

-- Add imageUrl column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'todos'
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE todos ADD COLUMN image_url TEXT;
    END IF;
END $$;
