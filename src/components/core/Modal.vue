<template>
  <div class="model-background">
    <div class="modal" :class="{ 'is-active': isActive }" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <icons
            width="32"
            height="32"
            icon="close"
            style="padding: 4px; cursor: pointer"
          />
        </button>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import Icons from "@/components/core/Icons.vue"

defineProps({
  isActive: {
    default: false,
    type: Boolean
  }
})
const emit = defineEmits(["close"])

const closeModal = () => emit("close")
</script>

<style scoped>
.model-background {
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

.modal-close {
  font-size: 0;
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 0;
  border-radius: 24px;
}

.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: #282a2b;
  width: min(500px, calc(100% - 20px));
  overflow-y: auto;
  border-radius: 16px;
  max-height: 100%;
}
</style>
