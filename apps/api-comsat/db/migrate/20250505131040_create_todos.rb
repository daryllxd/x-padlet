class CreateTodos < ActiveRecord::Migration[8.0]
  def change
    create_table :todos, id: :uuid do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :is_completed, null: false, default: false
      t.integer :position, null: false, default: 0
      t.references :todo_list, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.text :image_url
      t.text :theme
      t.references :todo_group, type: :uuid, foreign_key: { on_delete: :cascade }
      t.integer :position_in_group

      t.timestamps
    end

    # Add position constraint
    execute <<-SQL
      ALTER TABLE todos 
      ADD CONSTRAINT todos_position_check 
      CHECK (position >= 0);
    SQL

    # Add constraint for position_in_group
    execute <<-SQL
      ALTER TABLE todos 
      ADD CONSTRAINT todos_grouped_position_check 
      CHECK (position_in_group > 0);
    SQL

    # The todo_list_id and todo_group_id indexes are automatically created by t.references above
    # Only add the composite index
    add_index :todos, [:todo_group_id, :position_in_group], name: 'todos_group_position_idx'
  end
end
