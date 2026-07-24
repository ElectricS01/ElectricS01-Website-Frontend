<template>
  <transition>
    <div v-if="isActive" class="model-background">
      <div
        class="modal"
        :class="{ 'is-active': isActive }"
        @click="emit('close')"
      >
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="emit('close')">
            <icons size="32" icon="close" />
          </button>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import Icons from "@/components/core/Icons.vue"

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
  padding: 4px;
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
