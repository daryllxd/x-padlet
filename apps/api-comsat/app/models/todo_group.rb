class TodoGroup < ApplicationRecord
  # Relationships
  belongs_to :todo_list
  has_many :todos, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  default_scope { order(position: :asc) }

  # Methods
  def sorted_todos
    todos.order(position_in_group: :asc)
  end
end
