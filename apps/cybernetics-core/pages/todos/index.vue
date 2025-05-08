<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Todos</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all todos in the system.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true"> Add Todo </UButton>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Title
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="todo in todos" :key="todo.id">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  {{ todo.title }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <UBadge :color="todo.completed ? 'success' : 'warning'">
                    {{ todo.completed ? 'Completed' : 'Pending' }}
                  </UBadge>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ todo.userId }}
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                    @click="editTodo(todo)"
                  >
                    Edit
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <UModal v-model="isCreateModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900">Create Todo</h3>
        </template>

        <form @submit.prevent="createTodo">
          <div class="space-y-4">
            <UFormGroup label="Title">
              <UInput v-model="newTodo.title" />
            </UFormGroup>
            <UFormGroup label="User ID">
              <UInput v-model="newTodo.userId" type="number" />
            </UFormGroup>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="isCreateModalOpen = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="createTodo"> Create </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const todos = ref<Todo[]>([]);
const isCreateModalOpen = ref(false);
const newTodo = ref({
  title: '',
  userId: 1,
});

// Fetch todos
const fetchTodos = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  todos.value = await response.json();
};

// Create todo
const createTodo = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify({
      ...newTodo.value,
      completed: false,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const createdTodo = await response.json();
  todos.value.unshift(createdTodo);
  isCreateModalOpen.value = false;
  newTodo.value = { title: '', userId: 1 };
};

// Edit todo
const editTodo = (todo: Todo) => {
  // TODO: Implement edit functionality
  console.log('Edit todo:', todo);
};

// Initial fetch
fetchTodos();
</script>
