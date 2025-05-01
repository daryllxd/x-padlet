-- Add new columns with defaults
ALTER TABLE todo_lists
ADD COLUMN theme TEXT NOT NULL DEFAULT 'white',
ADD COLUMN background TEXT NOT NULL DEFAULT 'white',
ADD COLUMN display_mode TEXT NOT NULL DEFAULT 'masonry';

-- Update existing records to have the default values
UPDATE todo_lists
SET
  theme = 'white',
  background = 'white',
  display_mode = 'masonry'
WHERE
  theme IS NULL
  OR background IS NULL
  OR display_mode IS NULL;
