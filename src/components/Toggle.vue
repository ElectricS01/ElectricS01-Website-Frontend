<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="value"
      :disabled="disabled"
      @click="emit('switch')"
    />
    <span class="slider" />
  </label>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean; value?: boolean }>()
const emit = defineEmits<{ switch: [] }>()
</script>
