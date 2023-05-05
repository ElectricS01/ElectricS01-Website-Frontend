<template>
  <circle
    v-if="status === 'online'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="#47bf4c"
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
    fill="#ff2f2f"
  />
  <circle
    v-else-if="status === 'offline'"
    :cx="size"
    :cy="size"
    :r="size"
    fill="grey"
  />
</template>

<script>
export default {
  name: "StatusIndicator",
  props: ["size", "status"]
}
</script>

<style scoped></style>
