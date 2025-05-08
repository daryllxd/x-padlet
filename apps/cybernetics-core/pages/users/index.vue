<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Users</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all users in the system.</p>
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
                  Name
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Company
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  {{ user.name }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.email }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ user.company.name }}
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-eye"
                    :to="`/users/${user.id}`"
                  >
                    View
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Company {
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
}

const users = ref<User[]>([]);

// Fetch users
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  users.value = await response.json();
};

// Initial fetch
fetchUsers();
</script>
