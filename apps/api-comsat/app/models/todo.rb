class Todo < ApplicationRecord
  # Relationships
  belongs_to :todo_list
  belongs_to :todo_group, optional: true

  # Validations
  validates :title, presence: true
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :position_in_group, numericality: { greater_than: 0 }, allow_nil: true

  # Scopes
  default_scope { order(position: :asc) }
  scope :completed, -> { where(is_completed: true) }
  scope :incomplete, -> { where(is_completed: false) }

  # Callbacks
  before_validation :ensure_position_values

  # Methods
  def complete!
    update(is_completed: true)
  end

  def incomplete!
    update(is_completed: false)
  end

  def toggle_completion!
    update(is_completed: !is_completed)
  end

  private

  def ensure_position_values
    self.position ||= 0
  end
end
