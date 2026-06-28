<template>
  <div class="model-background">
    <div
      class="modal"
      :class="{ 'is-active': isActive }"
      @click="emit('close')"
    >
      <div @click.stop>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.model-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.modal {
  width: 100%;
  height: 100%;
  display: none;
  overflow-y: auto;
}

.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
