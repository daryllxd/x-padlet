<template>
  <aside class="w-64 bg-white shadow">
    <nav class="mt-5 px-2">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="group flex items-center rounded-md px-2 py-2 text-base font-medium"
        :class="[
          $route.path === item.href
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        ]"
      >
        <Icon
          :name="item.icon"
          class="mr-4 h-6 w-6 flex-shrink-0"
          :class="[
            $route.path === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
          ]"
          aria-hidden="true"
        />
        {{ item.name }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const navigation = [
  { name: 'Dashboard', href: '/', icon: 'heroicons:home' },
  { name: 'Todos', href: '/todos', icon: 'heroicons:clipboard-document-list' },
  { name: 'Users', href: '/users', icon: 'heroicons:users' },
];
</script>
