<template>
  <circle
    v-if="status === 'online'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="var(--green)"
  />
  <circle
    v-else-if="status === 'idle'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="gold"
  />
  <circle
    v-else-if="status === 'dnd'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="var(--red)"
  />
  <circle
    v-else-if="status === 'offline'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="grey"
  />
</template>

<script setup lang="ts">
defineProps<{
  size: string
  status?: string
}>()
</script>
