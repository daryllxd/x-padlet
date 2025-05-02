-- Enable Row Level Security
ALTER TABLE todo_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous users to view todo lists"
ON todo_lists
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous users to update todo lists"
ON todo_lists
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert todo lists"
ON todo_lists
FOR INSERT
TO anon
WITH CHECK (true);
