class CreateEnsureTodoListHasGroupTrigger < ActiveRecord::Migration[8.0]
  def up
    # Create the ensure_todo_list_has_group function
    execute <<-SQL
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
      $$ LANGUAGE plpgsql;
    SQL

    # Create the trigger on todo_lists
    execute <<-SQL
      CREATE TRIGGER ensure_todo_list_has_group_trigger
      AFTER INSERT ON todo_lists
      FOR EACH ROW
      EXECUTE FUNCTION ensure_todo_list_has_group();
    SQL
  end

  def down
    # Drop trigger
    execute <<-SQL
      DROP TRIGGER IF EXISTS ensure_todo_list_has_group_trigger ON todo_lists;
    SQL

    # Drop function
    execute <<-SQL
      DROP FUNCTION IF EXISTS ensure_todo_list_has_group();
    SQL
  end
end
