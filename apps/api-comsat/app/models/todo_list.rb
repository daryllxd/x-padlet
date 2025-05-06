class TodoList < ApplicationRecord
  # Enums
  enum :status, { active: "active", completed: "completed", archived: "archived" }, validate: true
  enum :privacy_status, { visible: "public", hidden: "secret", password_protected: "secret_with_password" }, validate: true

  # Relationships
  has_many :todo_groups, dependent: :destroy
  has_many :todos, dependent: :destroy

  # Validations
  validates :title, presence: true
  validates :position, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :theme, :background, :display_mode, presence: true

  # Callbacks
  after_create :ensure_default_group

  private

  # This is a fallback in case the PostgreSQL trigger doesn't work
  def ensure_default_group
    return if todo_groups.exists?
    todo_groups.create(name: "Section 1", position: 1)
  end
end
