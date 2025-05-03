-- Create enum type for privacy status
CREATE TYPE privacy_status AS ENUM ('public', 'secret', 'secret_with_password');

-- Add privacy_status column to todo_lists (nullable at first)
ALTER TABLE todo_lists
ADD COLUMN privacy_status privacy_status;

-- Set all existing todo lists to 'public'
UPDATE todo_lists
SET
  privacy_status = 'public'
WHERE
  privacy_status IS NULL;

-- Now add the NOT NULL constraint
ALTER TABLE todo_lists
ALTER COLUMN privacy_status
SET
  NOT NULL,
ALTER COLUMN privacy_status
SET DEFAULT 'public';

-- Add comment to explain the privacy status values
COMMENT ON COLUMN todo_lists.privacy_status IS 'Privacy status of the todo list: public (visible to everyone), secret (visible only to owner), secret_with_password (visible to those with password)';
