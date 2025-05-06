FactoryBot.define do
  factory :todo do
    sequence(:title) { |n| "Todo #{n}" }
    position { 1 }
    is_completed { false }
    association :todo_list
  end
end 