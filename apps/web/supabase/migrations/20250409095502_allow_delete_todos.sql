CREATE POLICY "Allow anonymous users to delete todos"
ON todos
FOR DELETE
TO anon
USING (true);