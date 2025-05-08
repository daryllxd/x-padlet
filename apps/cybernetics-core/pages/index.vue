<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">Welcome to Cybernetics Core Admin Panel</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Todos</h3>
            <Icon name="heroicons:clipboard-document-list" class="h-5 w-5 text-gray-400" />
          </div>
        </template>
        <p class="text-2xl font-semibold text-gray-900">200</p>
        <p class="text-sm text-gray-500">Total todos in the system</p>
        <template #footer>
          <NuxtLink to="/todos" class="text-primary-600 hover:text-primary-500 text-sm">
            View all todos →
          </NuxtLink>
        </template>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Users</h3>
            <Icon name="heroicons:users" class="h-5 w-5 text-gray-400" />
          </div>
        </template>
        <p class="text-2xl font-semibold text-gray-900">10</p>
        <p class="text-sm text-gray-500">Active users</p>
        <template #footer>
          <NuxtLink to="/users" class="text-primary-600 hover:text-primary-500 text-sm">
            View all users →
          </NuxtLink>
        </template>
      </UCard>
    </div>
  </div>
</template>
