require 'rails_helper'

RSpec.describe TodoList, type: :model do
  describe 'associations' do
    it { should have_many(:todo_groups).dependent(:destroy) }
    it { should have_many(:todos).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:position) }
    it { should validate_presence_of(:theme) }
    it { should validate_presence_of(:background) }
    it { should validate_presence_of(:display_mode) }
    it { should validate_numericality_of(:position).is_greater_than_or_equal_to(0) }
  end

  describe 'callbacks' do
    describe 'after_create' do
      context 'when no todo_groups exist' do
        let(:todo_list) { build(:todo_list) }

        it 'creates a default group' do
          expect { todo_list.save! }.to change(TodoGroup, :count).by(1)
          expect(todo_list.todo_groups.first.name).to eq('Section 1')
          expect(todo_list.todo_groups.first.position).to eq(1)
        end
      end

      context 'when todo_groups already exist' do
        let(:todo_list) { create(:todo_list) }
        let!(:existing_group) { create(:todo_group, todo_list: todo_list) }

        it 'does not create a default group' do
          expect { todo_list.save! }.not_to change(TodoGroup, :count)
        end
      end
    end
  end
end 