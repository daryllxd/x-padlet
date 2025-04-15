-- Add position column
ALTER TABLE todo_lists
ADD COLUMN position INTEGER;

-- Update position based on created_at order
WITH
  numbered_rows AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        ORDER BY
          created_at
      ) as row_num
    FROM
      todo_lists
  )
UPDATE todo_lists
SET
  position = numbered_rows.row_num
FROM
  numbered_rows
WHERE
  todo_lists.id = numbered_rows.id;

-- Make position column not null after seeding
ALTER TABLE todo_lists
ALTER COLUMN position
SET
  NOT NULL;
