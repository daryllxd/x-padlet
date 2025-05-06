require 'rails_helper'

RSpec.describe TodoGroup, type: :model do
  describe 'associations' do
    it { should belong_to(:todo_list) }
    it { should have_many(:todos).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:position) }
    it { should validate_numericality_of(:position).is_greater_than_or_equal_to(0) }
  end
end
