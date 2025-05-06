FactoryBot.define do
  factory :todo_list do
    sequence(:title) { |n| "Todo List #{n}" }
    theme { "default" }
    background { "default" }
    display_mode { "default" }
    sequence(:position) { |n| n }
  end
end
