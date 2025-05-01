CREATE POLICY "Allow anonymous users to delete todo_groups" ON todo_groups FOR DELETE TO anon USING (true);
