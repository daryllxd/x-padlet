FactoryBot.define do
  factory :todo_group do
    sequence(:name) { |n| "Group #{n}" }
    sequence(:position) { |n| n }
    association :todo_list
  end
end
