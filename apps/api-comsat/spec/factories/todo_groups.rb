FactoryBot.define do
  factory :todo_group do
    sequence(:name) { |n| "Group #{n}" }
    sequence(:position) { |n| n }
    association :todo_list

    trait :with_todos do
      after(:create) do |todo_group|
        create_list(:todo, 3, todo_group: todo_group)
      end
    end

    trait :with_completed_todos do
      after(:create) do |todo_group|
        create_list(:todo, 2, todo_group: todo_group, is_completed: true)
      end
    end

    trait :with_incomplete_todos do
      after(:create) do |todo_group|
        create_list(:todo, 2, todo_group: todo_group, is_completed: false)
      end
    end

    trait :empty do
      after(:create) do |todo_group|
        todo_group.todos.destroy_all
      end
    end
  end
end
