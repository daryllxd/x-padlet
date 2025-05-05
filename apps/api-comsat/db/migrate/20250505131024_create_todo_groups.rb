class CreateTodoGroups < ActiveRecord::Migration[8.0]
  def change
    create_table :todo_groups, id: :uuid do |t|
      t.string :name, null: false
      t.references :todo_list, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.integer :position, null: false, default: 0
      
      t.timestamps
    end

    # Add position constraint
    execute <<-SQL
      ALTER TABLE todo_groups 
      ADD CONSTRAINT todo_groups_position_check 
      CHECK (position >= 0);
    SQL
  end
end
