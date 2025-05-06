class CreateUpdateDateTriggers < ActiveRecord::Migration[8.0]
  def up
    # Create the update_updated_at_column function
    execute <<-SQL
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    SQL

    # Create the update_todo_groups_updated_at function
    execute <<-SQL
      CREATE OR REPLACE FUNCTION update_todo_groups_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    SQL

    # Create triggers for todos
    execute <<-SQL
      CREATE TRIGGER update_todos_updated_at
      BEFORE UPDATE ON todos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    SQL

    # Create triggers for todo_groups
    execute <<-SQL
      CREATE TRIGGER update_todo_groups_updated_at
      BEFORE UPDATE ON todo_groups
      FOR EACH ROW
      EXECUTE FUNCTION update_todo_groups_updated_at();
    SQL

    # Create triggers for contact_form_submissions
    execute <<-SQL
      CREATE TRIGGER update_contact_form_submissions_updated_at
      BEFORE UPDATE ON contact_form_submissions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    SQL
  end

  def down
    # Drop triggers
    execute <<-SQL
      DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
      DROP TRIGGER IF EXISTS update_todo_groups_updated_at ON todo_groups;
      DROP TRIGGER IF EXISTS update_contact_form_submissions_updated_at ON contact_form_submissions;
    SQL

    # Drop functions
    execute <<-SQL
      DROP FUNCTION IF EXISTS update_updated_at_column();
      DROP FUNCTION IF EXISTS update_todo_groups_updated_at();
    SQL
  end
end
