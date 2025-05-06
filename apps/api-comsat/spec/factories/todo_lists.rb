FactoryBot.define do
  factory :todo_list do
    sequence(:title) { |n| "Todo List #{n}" }
  end
end 