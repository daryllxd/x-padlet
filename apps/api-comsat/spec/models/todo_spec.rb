require 'rails_helper'

RSpec.describe Todo, type: :model do
  describe 'associations' do
    it { should belong_to(:todo_list) }
    it { should belong_to(:todo_group).optional }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_numericality_of(:position).is_greater_than_or_equal_to(0) }
    it { should validate_numericality_of(:position_in_group).is_greater_than(0).allow_nil }
  end

  describe 'scopes' do
    let!(:completed_todo) { create(:todo, is_completed: true, position: 1) }
    let!(:incomplete_todo) { create(:todo, is_completed: false) }
  end

  describe 'callbacks' do
    describe 'before_validation :ensure_position_values' do
      it 'sets default position to 0 if not present' do
        todo = build(:todo, position: nil)
        todo.valid?
        expect(todo.position).to eq(0)
      end
    end
  end
end
