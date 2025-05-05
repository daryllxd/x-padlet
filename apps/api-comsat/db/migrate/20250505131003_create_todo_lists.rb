class CreateTodoLists < ActiveRecord::Migration[8.0]
  def change
    # Create custom enum type for privacy_status
    create_enum :privacy_status, ['public', 'secret', 'secret_with_password']

    create_table :todo_lists, id: :uuid do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, null: false, default: 'active'
      t.integer :position, null: false
      t.text :theme, null: false, default: 'white'
      t.text :background, null: false, default: 'white'
      t.text :display_mode, null: false, default: 'masonry'
      t.text :custom_url
      t.string :icon
      t.enum :privacy_status, enum_type: :privacy_status, default: 'public', null: false

      t.timestamps
    end

    # Add check constraint for status values
    execute <<-SQL
      ALTER TABLE todo_lists 
      ADD CONSTRAINT todo_lists_status_check 
      CHECK (status IN ('active', 'completed', 'archived'));
    SQL

    # Add comment for icon column
    execute <<-SQL
      COMMENT ON COLUMN todo_lists.icon IS 'Icon identifier for the todo list';
    SQL

    # Add comment for privacy_status column
    execute <<-SQL
      COMMENT ON COLUMN todo_lists.privacy_status IS 'Privacy status of the todo list: public (visible to everyone), secret (visible only to owner), secret_with_password (visible to those with password)';
    SQL
  end
end
