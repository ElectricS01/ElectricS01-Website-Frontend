<template>
  <div class="background">
    <div class="modal" :class="{ 'is-active': isActive }" @click="closeModal">
      <div @click.stop>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isActive: {
    default: false
  }
})
const emit = defineEmits(["close"])

const closeModal = () => emit("close")
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.modal {
  width: 100%;
  height: calc(100% - 48px);
  padding-top: 48px;
  display: none;
  overflow-y: auto;
}

.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
